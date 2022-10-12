import { ListPostsQuery, Post } from 'API'
import { useEffect, useState } from 'react'

import { API } from 'aws-amplify'
import Link from 'next/link'
import { listPosts } from 'graphql/queries'

const Main = () => {
  const [posts, setPosts] = useState<Array<Post | null>>([])

  useEffect(() => {
    async function fetchPosts() {
      const postData = (await API.graphql({
        query: listPosts
      })) as { data: ListPostsQuery }

      if (postData.data.listPosts?.items) {
        setPosts(postData.data.listPosts.items)
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
          <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
            <h2 className="text-xl font-semibold">{post?.title}</h2>
            <p className="text-gray-500 mt-2">Autor: {post?.username}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export { Main }
