import { useEffect, useState } from 'react'

import Image from 'next/image'
import { PostPage } from './types'
import ReactMarkDown from 'react-markdown'
import { Storage } from 'aws-amplify'
import gfm from 'remark-gfm'
import { useRouter } from 'next/router'

const Main = ({ post }: PostPage) => {
  const [coverImage, setCoverImage] = useState<string | null>(null)

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
    </div>
  )
}

export { Main }
