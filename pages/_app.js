import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Head from 'next/head'

import customTheme from '@/styles/theme';
import {EnsCacheProvider} from '@/contexts/EnsCache';

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={customTheme} resetCSS>
      <EnsCacheProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </EnsCacheProvider>
    </ChakraProvider>
  )
}

export default App
