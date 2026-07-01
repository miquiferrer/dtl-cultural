// Supabase Edge Function: stripe-webhook
// Handles: customer.subscription.created/updated/deleted, invoice.payment_succeeded

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@17'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Map Stripe price IDs to subscription tiers
const PRICE_TIER_MAP: Record<string, 'basic' | 'premium'> = {
  [Deno.env.get('STRIPE_PRICE_BASIC') ?? '']: 'basic',
  [Deno.env.get('STRIPE_PRICE_PREMIUM') ?? '']: 'premium',
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id ?? ''
        const tier = PRICE_TIER_MAP[priceId]

        if (!tier) {
          console.warn('Unknown price ID:', priceId)
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
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.subscription) break

        const { error } = await supabase.rpc('reset_monthly_posts', {
          p_stripe_subscription_id: invoice.subscription as string,
        })
        if (error) throw error
        break
      }

      default:
        // Ignore unhandled events
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response('Internal error', { status: 500 })
  }
})
