import React, { useState, createContext, useEffect } from "react";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli, arbitrumGoerli, optimismGoerli, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { useNetwork } from "wagmi";

export const WalletContext = createContext(undefined);

export const WalletProvider = ({children}) => {

    const [tablelandSdk, setTablelandSdk] = useState(false);

    const { chains, provider } = configureChains(
        [mainnet, goerli, polygon, polygonMumbai, optimism, optimismGoerli, arbitrum, arbitrumGoerli ],
        [
          publicProvider()
        ]
    );

    const { connectors } = getDefaultWallets({
        appName: 'Tablescan',
        chains
    });

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider
    });

    const { chain } = useNetwork();

    async function setupSdk(){

        // try {

        //     let chainName = "";
        //     if (chain.name === "Ethereum") chainName = "ethereum";
        //     if (chain.name === 'Goerli') chainName = "ethereum-goerli";
        //     if (chain.name === "Polygon") chainName = "polygon";
        //     if (chain.name === "Polygon Mumbai") chainName = "polygon-mumbai";
        //     if (chain.name === "Optimism One") chainName = "optimism";
        //     if (chain.name === "Optimism Goerli") chainName = "optimism-goerli";
        //     if (chain.name === "Arbitrum One") chainName = "arbitrum";
        //     if (chain.name === "Arbitrum Goerli") chainName = "arbitrum-goerli";

        //     // const tableland = await connect({ network: "testnet", chain: chainName });
        //     // await tableland.siwe();
        //     // setTablelandSdk(tableland);
        //     return true;

        // } catch (error) {
        //     setTablelandSdk(false);
        //     return false;
        // }
    }

    useEffect(()=>{
        if (chain) setupSdk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain])

    const cleanStatement = (tableId="", tableName="", statement = "") => {

        statement = statement.replaceAll('\n', ' ');

        let justName = tableName.split('_');
        justName = justName.slice(0, justName.length-2).join('_');

        let statementCleaned = statement.slice(13+tableName.replace(`_${tableId}`, '').length).trim().replace('(','').replace(';','');
        statementCleaned = statementCleaned.slice(0, statementCleaned.length-1);

        // console.log({nameSimple, statementCleaned});


        return {justName, statementCleaned};
    }

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={darkTheme()} modalSize="compact" coolMode >
                <WalletContext.Provider value={{
                    cleanStatement,
                    setupSdk,
                    tablelandSdk
                }}>
                    {children}
                </WalletContext.Provider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
