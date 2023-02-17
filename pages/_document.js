import React from "react";
import { chakra, ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '@/styles/theme'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;500;800&display=swap" rel="stylesheet"></link>
        </Head>
        <chakra.body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main/>
          <NextScript />
        </chakra.body>
      </Html>
    )
  }
}
