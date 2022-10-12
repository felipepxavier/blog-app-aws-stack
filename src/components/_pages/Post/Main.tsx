import { PostPage } from './types'
import ReactMarkDown from 'react-markdown'
import gfm from 'remark-gfm'
import { useRouter } from 'next/router'

const Main = ({ post }: PostPage) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracing-wide">{post.title}</h1>

      <p className="text-sm font-light my-4">By {post.username}</p>

      <div className="mt-8">
        <ReactMarkDown remarkPlugins={[gfm]}>{post.content!}</ReactMarkDown>
      </div>
    </div>
  )
}

export { Main }
