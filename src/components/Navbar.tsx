import { Auth, Hub } from 'aws-amplify'
import { useEffect, useState } from 'react'

import Link from 'next/link'

const Navbar = () => {
    const [signedUser, setSignedUser] = useState(false)

    useEffect(() => {
        async function authListener() {
            Hub.listen("auth", ({ payload }) => {
                switch (payload.event) {
                    case "signIn":
                        return setSignedUser(true)
                    case "signOut":
                        return setSignedUser(false)
                }
            })
    
            try {
                await Auth.currentAuthenticatedUser()
                setSignedUser(true)
            } catch (error) {
                console.error(error)
            }
        }

        authListener()
    }, [])

    return (
        <nav className="flex justify-center pt-3 pb-3 space-x-4 border-b bg-cyan-500 border-gray-300">
            {
                [
                    ['Início', '/'],
                    ['Criar Postagem', '/create-post'],
                    ['Perfil', '/profile'],
                ].map(([title, url], index) => 
                <Link key={url+index} href={url}>
                    <a className="rounded-lg px-3 py-2 text-slate-700 
                    font-medium hover:bg-slage-100 hover:text-slate-900">
                    {title}
                    </a>
                </Link>)
            }

            {
                signedUser && (
                    <Link href="/my-posts">
                        <a className="rounded-lg px-3 py-2 text-slate-700 
                    font-medium hover:bg-slage-100 hover:text-slate-900">
                        Minhas postagens
                        </a>
                    </Link>
                )
            }
        </nav>
    )

}

export { Navbar }