import { API, Storage } from 'aws-amplify'
import { useRef, useState } from 'react'

import Image from 'next/image'
import { Post } from 'API'
import { createPost } from 'graphql/mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
})
//import SimpleMDE from 'react-simplemde-editor'

const initialState = {
  title: '',
  content: '',
  id: '',
  coverImage: ''
}

const Main = () => {
  const router = useRouter()
  const [post, setPost] = useState<Post | undefined | null>(
    initialState as Post
  )
  const [image, setImage] = useState<File | null>(null)
  const imageFileInput = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost((oldState) => ({
      ...oldState!,
      [event.target.name]: event.target.value
    }))
  }

  const createNewPost = async () => {
    const { title, content } = post!
    if (!title || !content) return
    const id = uuid()
    post!.id = id

    if (image) {
      const filename = `${image?.name}_${uuid()}`
      post!.coverImage = filename
      await Storage.put(filename, image)
    }

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })

    router.push(`/posts/${id}`)
  }

  const uploadImage = async () => {
    imageFileInput.current?.click()
  }

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event?.target?.files![0]
    if (!fileUploaded) return
    setImage(fileUploaded)
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
        value={post!.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />

      {image && (
        <Image
          src={URL.createObjectURL(image)}
          alt="visualização da imagem"
          className="my-4"
          width="500"
          height="500"
        />
      )}
      <SimpleMDE
        value={post!.content!}
        onChange={(value) => setPost({ ...post!, content: value })}
      />
      <input
        type="file"
        ref={imageFileInput}
        className="absolute w-0 h-0"
        onChange={handleChangeImage}
      />
      <button
        type="button"
        className="bg-green-600 text-white font-semibold px-8 py-2 rounded-lg mr-2"
        onClick={uploadImage}
      >
        Upload de imagem
      </button>

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
