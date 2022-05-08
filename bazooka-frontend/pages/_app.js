import Layout from '../components/Layout'
import '../styles/globals.css'
import { useRouter } from 'next/router'
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  console.log(pathname)

  if (pathname == '/') return (<MoralisProvider serverUrl="https://jcztwovkb6hu.usemoralis.com:2053/server" appId="S0Oh1TScjaAs1joJ3DEsSL4KHPJfHj8fLdqb4cY7">
    <Component {...pageProps} />
  </MoralisProvider>)

  else return (<MoralisProvider serverUrl="https://jcztwovkb6hu.usemoralis.com:2053/server" appId="S0Oh1TScjaAs1joJ3DEsSL4KHPJfHj8fLdqb4cY7">
    <Layout><Component {...pageProps} /></Layout>
  </MoralisProvider>)
}

export default MyApp
