import Layout from '../components/Layout'
import '../styles/globals.css'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const {pathname} = useRouter();
  console.log(pathname)

  if(pathname=='/') return <Component {...pageProps} />
  else return <Layout><Component {...pageProps} /></Layout>
}

export default MyApp
