import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { query as q } from 'faunadb'
import { faunadb } from '../../../services/faunadb'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken

      try {
        const activeSubscription = await faunadb.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active')
            ])
          )
        )
        return { ...session, activeSubscription: activeSubscription }
      } catch {
        return { ...session, activeSubscription: null }
      }
    },
    async signIn({ user }) {
      const { email } = user

      try {
        await faunadb.query(
          q.If(
            q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email))),
            true,
            q.Create(q.Collection('users'), { data: { email } })
          )
        )

        return true
      } catch (error) {
        console.log(error)

        return false
      }
    }
  }
}

export default NextAuth(authOptions)
