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
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
    async signIn({ user }) {
      const { email } = user

      try {
        await faunadb.query(
          q.Create(q.Collection('users'), { data: { email } })
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
