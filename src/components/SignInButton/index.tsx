import React from 'react'
import { FaGithub, FaTimes } from 'react-icons/fa'
import { useSession, signIn, signOut } from 'next-auth/react'

import styles from './SigninButton.module.scss'

const SignInButton: React.FC = () => {
  const { data: session } = useSession()

  if (!session)
    return (
      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signIn('github')}
      >
        <FaGithub color="#eba417" />
        Login com Github
      </button>
    )
  else {
    return (
      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signOut()}
      >
        <FaGithub color="green" />
        {session.user?.name}
        <FaTimes className={styles.closeIcon} />
      </button>
    )
  }
}

export default SignInButton
