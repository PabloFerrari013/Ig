import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import { getPrismicClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'
import Head from 'next/head'

import styles from './post.module.scss'

interface PostProps {
  slug: string
  title: string
  content: string
  updatedAt: string
}

export default function Post(post: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.postContent}>
        <article className={styles.post}>
          <h1>{post.title}</h1>

          <time>{post.updatedAt}</time>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params
}) => {
  const session = await getSession({ req })

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${params.slug}`,
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID(
    'publication',
    String(params.slug),
    {}
  )

  const post = {
    slug: params.slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  return { props: post }
}
