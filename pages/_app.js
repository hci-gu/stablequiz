import '../styles/globals.css'
import Head from 'next/head'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
