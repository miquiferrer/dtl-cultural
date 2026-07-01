import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const STRIPE_PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
} as const
