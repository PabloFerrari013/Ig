import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'

export function getPrismicClient(req?: unknown) {
  const client = prismic.createClient(process.env.PRISMC_ENDPOINT, {
    accessToken: process.env.PRISMC_ACCESS_TOKEN
  })

  prismicNext.enableAutoPreviews({
    client,
    req: req
  })

  return client
}
