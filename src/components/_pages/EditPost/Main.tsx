import 'easymde/dist/easymde.min.css'

import { API, Storage } from 'aws-amplify'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { GetPostQuery, Post } from 'API'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { getPost } from 'graphql/queries'
import { updatePost } from 'graphql/mutations'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
})
// import SimpleMDE from "react-simplemde-editor";

function Main() {
  const [post, setPost] = useState<Post | undefined | null>(undefined)
  const [coverImage, setCoverImage] = useState<File | string | null>(null)
  const [localImage, setLocalImage] = useState<string | null>(null)
  const imagefileInput = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    async function updateCoverImage(coverImage: string) {
      const imageKey = await Storage.get(coverImage)
      setCoverImage(imageKey)
    }

    async function fetchPost() {
      if (!id) return
      const postData = (await API.graphql({
        query: getPost,
        variables: { id }
      })) as { data: GetPostQuery }
      setPost(postData.data.getPost)

      if (postData.data.getPost?.coverImage) {
        updateCoverImage(postData.data.getPost.coverImage)
      }
    }
    fetchPost()
  }, [id])

  if (!post) return null

  const uploadImage = async () => {
    imagefileInput.current?.click()
  }

  function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    const fileUploaded = event?.target?.files![0]
    if (!fileUploaded) return

    setCoverImage(fileUploaded)
    setLocalImage(URL.createObjectURL(fileUploaded))
  }

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
    const postUpdated: { [key: string]: string | string[] | undefined } = {
      id,
      content,
      title
    }

    if (coverImage && localImage) {
      const filename = `${(coverImage as File).name}_${uuid()}`
      postUpdated.coverImage = filename

      await Storage.put(filename, coverImage)
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

      {coverImage && (
        <Image
          src={localImage ? localImage : (coverImage as string)}
          alt="visualização da imagem"
          className="my-4"
          width="500"
          height="500"
        />
      )}

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
      <input
        type="file"
        ref={imagefileInput}
        className="absolute w-0 h-0"
        onChange={handleChangeImage}
      />

      <button
        className="mr-4 bg-purple-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={uploadImage}
      >
        Upload de imagem
      </button>

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
