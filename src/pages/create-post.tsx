import 'easymde/dist/easymde.min.css'

import { Main } from 'components/_pages/CreatePost/Main'
import { NextPage } from 'next'
import { withAuthenticator } from '@aws-amplify/ui-react'

const CreatePost: NextPage = () => {
  return <Main />
}

export default withAuthenticator(CreatePost)
