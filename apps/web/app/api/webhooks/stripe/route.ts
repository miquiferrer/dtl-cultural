import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'
import type { Stripe as StripeTypes } from 'stripe'

// Admin client — bypasses RLS, used only in server-side webhook
function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const PRICE_TIER_MAP: Record<string, 'basic' | 'premium'> = {
  [process.env.STRIPE_PRICE_BASIC!]: 'basic',
  [process.env.STRIPE_PRICE_PREMIUM!]: 'premium',
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const body = await request.text()
  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    ) as Stripe.Event
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id ?? ''
        const tier = PRICE_TIER_MAP[priceId]

        if (!tier) {
          console.warn('Unknown price ID in webhook:', priceId)
          break
        }

        const { error } = await supabase.rpc('update_subscription', {
          p_stripe_customer_id: subscription.customer as string,
          p_stripe_subscription_id: subscription.id,
          p_tier: tier,
        })
        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { error } = await supabase.rpc('cancel_subscription', {
          p_stripe_customer_id: subscription.customer as string,
        })
        if (error) throw error
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
        if (!invoice.subscription) break

        const { error } = await supabase.rpc('reset_monthly_posts', {
          p_stripe_subscription_id: invoice.subscription,
        })
        if (error) throw error
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
