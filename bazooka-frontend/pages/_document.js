import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <title>Bazooka Battles</title>
      <body>
        <div id='bgblur'></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}