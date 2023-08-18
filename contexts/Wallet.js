import React, { createContext } from "react";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { arbitrum, arbitrumGoerli, filecoin, filecoinCalibration, goerli, mainnet, optimism, optimismGoerli, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const WalletContext = createContext(undefined);


export const WalletProvider = ({ children }) => {

  const arbitrumNova = {
    id: 42170,
    name: 'Arbitrum Nova',
    network: 'arbitrumNova',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      public: { http: ['https://nova.arbitrum.io/rpc'] },
      default: { http: ['https://nova.arbitrum.io/rpc'] },
    },
    blockExplorers: {
      etherscan: { name: 'Arbirscan', url: 'https://nova.arbiscan.io' },
      default: { name: 'Arbiscan', url: 'https://nova.arbiscan.io' },
    },
    contracts: {},
  }
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, goerli, polygon, polygonMumbai, optimism, optimismGoerli, arbitrum, arbitrumGoerli, arbitrumNova, filecoin, filecoinCalibration],
    [
      publicProvider()
    ]
  );
  const projectId = 'd956959c5b97073bd3ce9c791dc65aa3';

  const { connectors } = getDefaultWallets({
    appName: 'Tablescan.io',
    projectId,
    chains
  });

  const appInfo = {
    appName: 'Tablescan.io',
  };

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  const cleanStatement = (tableId = "", tableName = "", statement = "") => {

    statement = statement.replaceAll('\n', ' ');

    let justName = tableName.split('_');
    justName = justName.slice(0, justName.length - 2).join('_');

    let statementCleaned = statement.slice(13 + tableName.replace(`_${tableId}`, '').length).trim().replace('(', '').replace(';', '');
    statementCleaned = statementCleaned.slice(0, statementCleaned.length - 1);

    // console.log({nameSimple, statementCleaned});

    return { justName, statementCleaned };
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()} modalSize="compact" coolMode showRecentTransactions={true} appInfo={appInfo}>
        <WalletContext.Provider value={{
          cleanStatement
        }}>
          {children}
        </WalletContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
