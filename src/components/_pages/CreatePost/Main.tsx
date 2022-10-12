import { API } from 'aws-amplify'
import { createPost } from 'graphql/mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
})
//import SimpleMDE from 'react-simplemde-editor'

const initialState = {
  title: '',
  content: '',
  id: ''
}

const Main = () => {
  const router = useRouter()
  const [post, setPost] = useState(initialState)
  const { title, content } = post

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost((oldState) => ({
      ...oldState,
      [event.target.name]: event.target.value
    }))
  }

  const createNewPost = async () => {
    if (!title || !content) return
    const id = uuid()
    post.id = id

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })

    router.push(`/posts/${id}`)
  }

  return (
    <div>
      <h1 className="text-3x1 font-semibold tracking-wide mt-6">
        Criar nova Postagem
      </h1>

      <input
        onChange={handleChange}
        name="title"
        placeholder="Título"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />

      <button
        type="button"
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPost}
      >
        Criar postagem
      </button>
    </div>
  )
}

export { Main }
