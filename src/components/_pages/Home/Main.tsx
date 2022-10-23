import { API, Storage } from 'aws-amplify'
import { ListPostsQuery, Post } from 'API'
import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { listPosts } from 'graphql/queries'

const Main = () => {
  const [posts, setPosts] = useState<Array<Post | null>>([])

  useEffect(() => {
    async function fetchPosts() {
      const postData = (await API.graphql({
        query: listPosts
      })) as { data: ListPostsQuery }

      const items = postData.data.listPosts?.items

      if (items) {
        const postWithImages = await Promise.all(
          items.map(async (post) => {
            if (post?.coverImage) {
              post.coverImage = await Storage.get(post?.coverImage)
            }
            return post
          })
        )
        setPosts(postWithImages)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-sky-400 tracking-wide mt-6 mb-2">
        Minhas Postagens
      </h1>

      {posts.map((post) => (
        <Link key={post?.id} href={`/posts/${post?.id}`}>
          <div className="my-6 pb-6 border-b border-gray-300">
            {post?.coverImage && (
              <Image
                src={post.coverImage}
                alt="visualização da imagem"
                className="bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"
                width="144"
                height="144"
              />
            )}
            <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
              <h2 className="text-xl font-semibold">{post?.title}</h2>
              <p className="text-gray-500 mt-2">Autor: {post?.username}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export { Main }
