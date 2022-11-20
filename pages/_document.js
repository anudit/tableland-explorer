import React from "react";
import { chakra, ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '@/styles/theme'
import Script from "next/script";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <Script async defer data-website-id="3fd38d02-6d5b-4041-ab46-c904808194bf" src="https://umami-tablescan.vercel.app/umami.js"></Script>
        <chakra.body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </chakra.body>
      </Html>
    )
  }
}
