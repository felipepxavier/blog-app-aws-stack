import '../../styles/globals.css'
import '../../configureAmplify'

import type { AppProps } from 'next/app'
import { Navbar } from '../components/Navbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
    <Navbar />
    <div className='py-8 px-16 bg-slate-100'>
     <Component {...pageProps} />
    </div>
    </div>
  )
}

export default MyApp
