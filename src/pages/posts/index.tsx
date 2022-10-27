import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { getPrismicClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'

import styles from './styles.module.scss'

type Post = {
  slug: string
  title: string
  exerpert: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <a key={post.slug}>
              <time>{post.updatedAt}</time>

              <strong>{post.title}</strong>

              <p>{post.exerpert}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.getAllByType('publication', {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  })

  const posts = response.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      exerpert:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    }
  })

  return {
    props: { posts }
  }
}
