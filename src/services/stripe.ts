import Stripe from 'stripe'
import { version } from '../../package.json'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
  appInfo: {
    name: 'Ignews',
    version
  }
})
