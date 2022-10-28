import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import { getPrismicClient } from '../../../services/prismic'

import styles from '../post.module.scss'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface PostPreviewProps {
  slug: string
  title: string
  content: string
  updatedAt: string
}

export default function PostPreview(post: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session, post.slug, router])

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient()

  const response = await prismic.getByUID(
    'publication',
    String(params.slug),
    {}
  )

  const post = {
    slug: params.slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  return { props: post, redirect: 60 * 30 }
}
