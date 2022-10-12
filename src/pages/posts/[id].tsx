import '../../../configureAmplify'

import { GetPostQuery, ListPostsQuery } from '../../API'
import {
  PostPage,
  PostParamStaticProps
} from '../../components/_pages/Post/types'
import { getPost, listPosts } from '../../graphql/queries'

import { API } from 'aws-amplify'
import { Main } from 'components/_pages/Post/Main'

const Post = ({ post }: PostPage) => {
  return <Main post={post} />
}

export default Post

export async function getStaticPaths() {
  const postData = (await API.graphql({
    query: listPosts
  })) as { data: ListPostsQuery }
  const paths = postData.data.listPosts?.items.map((post) => ({
    params: { id: post?.id }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }: PostParamStaticProps) {
  const { id } = params

  const postData = (await API.graphql({
    query: getPost,
    variables: { id }
  })) as { data: GetPostQuery }

  return {
    props: {
      post: postData.data.getPost
    },
    revalidate: 1
  }
}
