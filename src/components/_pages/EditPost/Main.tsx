import 'easymde/dist/easymde.min.css'

import { ChangeEvent, useEffect, useState } from 'react'
import { GetPostQuery, Post } from 'API'

import { API } from 'aws-amplify'
import dynamic from 'next/dynamic'
import { getPost } from 'graphql/queries'
import { updatePost } from 'graphql/mutations'
import { useRouter } from 'next/router'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
})
// import SimpleMDE from "react-simplemde-editor";

function Main() {
  const [post, setPost] = useState<Post | undefined | null>(undefined)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    async function fetchPost() {
      if (!id) return
      const postData = (await API.graphql({
        query: getPost,
        variables: { id }
      })) as { data: GetPostQuery }
      setPost(postData.data.getPost)
    }
    fetchPost()
  }, [id])

  if (!post) return null

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const propName = event.target.name
    const newValue = event.target.value

    setPost(() => ({
      ...post!,
      [propName]: newValue
    }))
  }

  async function updateCurrentPost() {
    const { title, content } = post!
    if (!title || !content) return
    const postUpdated = {
      id,
      content,
      title
    }

    await API.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    router.push('/my-posts')
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        Editar Postagem
      </h1>

      <input
        onChange={handleChange}
        name="title"
        placeholder="Título"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE
        value={post.content!}
        onChange={(value) => setPost({ ...post, content: value })}
      />

      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}
      >
        Atualizar Postagem
      </button>
    </div>
  )
}

export default Main
