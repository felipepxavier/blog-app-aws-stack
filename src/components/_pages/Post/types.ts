import { Post } from '../../../API'

export type PostParamStaticProps = {
  params: {
    id: string
  }
}

export type PostResponseStaticProps = {
  props: {
    post: Post | undefined | null
  }
}

export type PostPage = {
  post: Post
}
