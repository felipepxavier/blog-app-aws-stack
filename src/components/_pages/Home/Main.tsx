/* eslint-disable @typescript-eslint/no-explicit-any */

import { API, Storage, graphqlOperation } from 'aws-amplify'
import { ListPostsQuery, NewOnCreatePostSubscription, Post } from 'API'
import { useEffect, useState } from 'react'

import { GraphQLSubscription } from '@aws-amplify/api'
import Image from 'next/image'
import Link from 'next/link'
import { listPosts } from 'graphql/queries'
import { newOnCreatePost } from 'graphql/subscriptions'

const Main = () => {
  const [posts, setPosts] = useState<Array<Post | null>>([])

  useEffect(() => {
    let subOncreate: any

    function setUpSubscriptions() {
      subOncreate = API.graphql<
        GraphQLSubscription<NewOnCreatePostSubscription>
      >(graphqlOperation(newOnCreatePost)).subscribe({
        next: (postData) => {
          const newPost = postData.value.data?.newOnCreatePost
          if (newPost) {
            setPosts((oldState) => [newPost, ...oldState])
          }
        }
      })
    }

    setUpSubscriptions()
    return () => {
      subOncreate.unsubscribe()
    }
  }, [])

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
        Postagens
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

              {post?.comments &&
                post.comments.items?.length > 0 &&
                post.comments.items.map((comment) => (
                  <div
                    key={comment!.id}
                    className="py-8 px-8 max-w-xl mx-auto bg-white rounded-xl 
                  shadow-lg space-y-2 sm:py-1 sm:flex 
                  my-6
                  mx-12
                  sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
                  >
                    <div>
                      <p className="text-gray-500 mt-2">{comment?.message}</p>
                      <p className="text-gray-200 mt-1">{comment?.createdBy}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export { Main }
