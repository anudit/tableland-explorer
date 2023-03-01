import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Head from 'next/head'
import customTheme from '@/styles/theme';
import {EnsCacheProvider} from '@/contexts/EnsCache';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import Script from "next/script";
import { WalletProvider } from "@/contexts/Wallet";

const client = createReactClient({
  provider: studioProvider({ apiKey: 'cec3b877-1c4d-4773-a06a-7785ea58f4b3' }),
});

const App = ({ Component, pageProps }) => {
  return (
    <WalletProvider>
      <ChakraProvider theme={customTheme} resetCSS>
        <EnsCacheProvider>
          <LivepeerConfig client={client}>
            <Script
              async
              defer
              data-website-id="3fd38d02-6d5b-4041-ab46-c904808194bf"
              src="https://umami-stats.vercel.app/umami.js"
            />
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps}/>
          </LivepeerConfig>
        </EnsCacheProvider>
      </ChakraProvider>
    </WalletProvider>
  )
}

export default App
