import { API, Auth } from 'aws-amplify'
import { Post, PostsByUsernameQuery } from 'API'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { deletePost } from 'graphql/mutations'
import moment from 'moment'
import { postsByUsername } from 'graphql/queries'

const Main = () => {
  const [posts, setPosts] = useState<Array<Post | null> | undefined>([])
  const fetchPosts = async () => {
    const user = await Auth.currentAuthenticatedUser()
    const username = `${user.attributes.sub}::${user.username}`

    const postData = (await API.graphql({
      query: postsByUsername,
      variables: { username }
    })) as { data: PostsByUsernameQuery }

    setPosts(postData.data.postsByUsername?.items)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDeletePost = async (id: string | undefined) => {
    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })

    fetchPosts()
  }

  return (
    <div>
      {posts?.map((post, index) => (
        <div
          key={index}
          className="py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-1 sm:flex 
        sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
        >
          <div className="text-center space-y-2 sm:text-left">
            <div className="space-y-0.5">
              <p className="text-lg text-black font-semibold">{post?.title}</p>
              <p className="text-slate-500 font-medium">
                Criado em: {moment(post?.createdAt).format('ddd, MMM hh:mm a')}
              </p>
            </div>
            <div
              className="sm:py-4 sm:flex 
      sm:items-center sm:space-y-0 sm:space-x-1"
            >
              <p
                className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 
  hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none 
  focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Link href={`/edit-post/${post?.id}`}>Editar Postagem</Link>
              </p>

              <p
                className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 
  hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none 
  focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Link href={`/posts/${post?.id}`}>Visualizar Postagem</Link>
              </p>

              <button
                className="text-sm mr-4 text-red-500"
                onClick={() => handleDeletePost(post?.id)}
              >
                Deletar Postagem
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { Main }
