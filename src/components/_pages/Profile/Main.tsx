import { useEffect, useState } from 'react'

import { AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { CognitoUserInterface } from '@aws-amplify/ui-components'

const Main = () => {
  const [user, setUser] = useState<CognitoUserInterface | undefined>(undefined)

  useEffect(() => {
    async function checkUser() {
      const user = await Auth.currentAuthenticatedUser()
      setUser(user)
    }
    checkUser()
  }, [])

  if (!user) return null

  return (
    <div>
      <h1 className="text-3x1 font-semibold tracking-wide mt-6">Perfil</h1>
      <h2 className="font-medium text-gray-500 my-2">
        Username: {user.username}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Email: {user.attributes.email}
      </p>
      <AmplifySignOut />
    </div>
  )
}

export { Main }
