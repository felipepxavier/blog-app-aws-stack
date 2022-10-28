import { API, Storage } from 'aws-amplify'
import { useEffect, useState } from 'react'

import { CreateCommentInput } from 'API'
import Image from 'next/image'
import { PostPage } from './types'
import ReactMarkDown from 'react-markdown'
import { createComment } from 'graphql/mutations'
import dynamic from 'next/dynamic'
import gfm from 'remark-gfm'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
})

const INITIAL_STATE = { message: '' }
const Main = ({ post }: PostPage) => {
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [comment, setComment] = useState<CreateCommentInput>(INITIAL_STATE)
  const [showMe, setShowMe] = useState(false)

  const toggle = () => {
    setShowMe(!showMe)
  }

  useEffect(() => {
    async function updateCoverImage() {
      if (post.coverImage) {
        const imageKey = await Storage.get(post.coverImage)
        setCoverImage(imageKey)
      }
    }
    updateCoverImage()
  }, [post])

  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const createTheComment = async () => {
    if (!comment.message) return
    const id = uuid()
    comment.id = id
    try {
      await API.graphql({
        query: createComment,
        variables: { input: comment },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      })
    } catch (error) {
      console.log(error)
    }
    router.push('/my-posts')
  }

  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracing-wide">{post.title}</h1>

      {coverImage && (
        <Image
          src={coverImage}
          alt="visualização da imagem"
          className="my-4"
          width="500"
          height="500"
        />
      )}

      <p className="text-sm font-light my-4">By {post.username}</p>

      <div className="mt-8">
        <ReactMarkDown remarkPlugins={[gfm]}>{post.content!}</ReactMarkDown>
      </div>

      <div>
        <button
          type="button"
          className="mb-4 bg-green-600 
        text-white font-semibold px-8 py-2 rounded-lg"
          onClick={toggle}
        >
          Escreva um comentário
        </button>

        <div style={{ display: showMe ? 'block' : 'none' }}>
          <SimpleMDE
            value={comment.message!}
            onChange={(value) =>
              setComment({ ...comment, message: value, postID: post.id })
            }
          />
          <button
            onClick={createTheComment}
            type="button"
            className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export { Main }
