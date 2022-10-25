import React from 'react'
import { signIn, useSession } from 'next-auth/react'

import styles from './SubscribeButton.module.scss'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface SubscribeButtonProps {
  priceId: string
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ priceId }) => {
  const { data: session } = useSession()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe')
      const { sessionId } = await response.data
      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}

export default SubscribeButton
