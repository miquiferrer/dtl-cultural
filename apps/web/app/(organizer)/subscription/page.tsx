import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import type { Profile } from '@dtl-cultural/shared'

const TIERS = [
  {
    key: 'free' as const,
    name: 'Gratuito',
    price: '€0 / mes',
    posts: '1 publicación / mes',
  },
  {
    key: 'basic' as const,
    name: 'Básico',
    price: '€9,99 / mes',
    posts: '10 publicaciones / mes',
    priceId: process.env.STRIPE_PRICE_BASIC,
  },
  {
    key: 'premium' as const,
    name: 'Premium',
    price: '€100 / mes',
    posts: '100 publicaciones / mes',
    priceId: process.env.STRIPE_PRICE_PREMIUM,
  },
]

export default async function SubscriptionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, posts_used_this_month, stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single<
      Pick<
        Profile,
        | 'subscription_tier'
        | 'posts_used_this_month'
        | 'stripe_customer_id'
        | 'stripe_subscription_id'
      >
    >()

  if (!profile) redirect('/login')

  const currentTier = profile.subscription_tier

  // Get Stripe portal URL for existing subscribers
  let portalUrl: string | null = null
  if (profile.stripe_customer_id && currentTier !== 'free') {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    })
    portalUrl = session.url
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu suscripción</h1>
      <p className="text-gray-500 mb-8">
        Plan actual:{' '}
        <span className="font-semibold capitalize">{currentTier}</span>
      </p>

      {/* Manage existing subscription */}
      {portalUrl && (
        <div className="mb-8 rounded-lg bg-gray-50 border border-gray-200 px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Gestiona tus pagos, facturas y cancela tu suscripción desde el portal de Stripe.
          </p>
          <a
            href={portalUrl}
            className="ml-4 shrink-0 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Gestionar suscripción →
          </a>
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const isCurrent = tier.key === currentTier
          const canUpgrade = tier.key !== 'free' && tier.key !== currentTier

          return (
            <div
              key={tier.key}
              className={`rounded-xl p-6 border flex flex-col ${
                isCurrent
                  ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h2 className="font-semibold text-gray-900">{tier.name}</h2>
              <p className="text-2xl font-bold mt-1 text-gray-900">{tier.price}</p>
              <p className="text-sm text-gray-500 mt-1">{tier.posts}</p>

              <div className="mt-auto pt-6">
                {isCurrent ? (
                  <span className="block text-center text-sm font-medium text-indigo-600 py-2">
                    Plan actual
                  </span>
                ) : canUpgrade ? (
                  <form action="/api/checkout" method="POST">
                    <input type="hidden" name="priceId" value={tier.priceId} />
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      Cambiar a {tier.name}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
