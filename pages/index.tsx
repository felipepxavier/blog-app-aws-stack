import { ListPostsQuery, Post } from '../src/API'
import {useEffect, useState} from 'react'

import { API } from 'aws-amplify'
import type { NextPage } from 'next'
import { listPosts } from '../src/graphql/queries'

const Home: NextPage = () => {
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
     <h1 className="text-6xl font-bold underline text-sky-400">
      Minhas Postagens
    </h1>

    {
      posts.map((post) => 
      (<p key={post?.id}>{post?.title}</p>)
      )
    }
   </div>
  )
}

export default Home
