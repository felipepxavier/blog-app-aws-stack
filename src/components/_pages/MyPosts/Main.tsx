import { API, Auth } from 'aws-amplify'
import { Post, PostsByUsernameQuery } from 'API'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { postsByUsername } from 'graphql/queries'

const Main = () => {
  const [posts, setPosts] = useState<Array<Post | null> | undefined>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const user = await Auth.currentAuthenticatedUser()
      const username = `${user.attributes.sub}::${user.username}`

      const postData = (await API.graphql({
        query: postsByUsername,
        variables: { username }
      })) as { data: PostsByUsernameQuery }

      setPosts(postData.data.postsByUsername?.items)
    }

    fetchPosts()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        Minhas Postagens
      </h1>

      {posts?.map((post) => (
        <Link key={post?.id} href={`/posts/${post?.id}`}>
          <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
            <h2 className="text-x1 font-semibold"> {post?.title}</h2>
            <p className="text-gray-500 mt-2">Autor: {post?.username} </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export { Main }
