import { Main } from 'components/_pages/Profile/Main'
import { NextPage } from 'next'
import { withAuthenticator } from '@aws-amplify/ui-react'

const Profile: NextPage = () => {
  return <Main />
}

export default withAuthenticator(Profile)
