import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Grid } from "@githubocto/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import NavBar from '../components/Navbar';
import Head from 'next/head';
import { nameToSubgraph, parseTableData } from '@/utils/stringUtils';

const IdentitySection = () => {

    const router = useRouter();
    const { tableName } = router.query;
    const [refreshing, setRefreshing] = useState(false);
    const [tableMetadata, setTableMetadata] = useState(false);

    const { data, error, mutate, isValidating } = useSWR(
        tableName ? [`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`] : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    useEffect(()=>{
        async function run(){
            if (tableName){
                let subgraph = nameToSubgraph(tableName);
                if (subgraph){
                    let data = await fetcher(subgraph, "POST", {
                        query: `
                            query {
                                tables(where: {name: "${tableName}"}, limit: 100) {
                                    id
                                    name
                                    owner
                                    tableId
                                    statement
                                    tokenURI
                                    created
                                }
                            }
                        `
                    })
                    setTableMetadata(data?.data?.tables[0]);
                }
            }
        }
        run();
    },[tableName])

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`);
        mutate(data);
        setRefreshing(false);
    }

    if (error) return <div>failed to load, {error}</div>;
    if (!data) return (
        <Flex alignContent="center" direction="column" height="100vh" width="100vw">
            <Spinner />
        </Flex>
    );
    else {

        let {tableId, chainId} = parseTableData(tableName);
        const url = `https://render.tableland.xyz/${chainId}/${tableId}`;
        return (
            <>
                <Head>
                    <title>Tableland Explorer</title>
                    <meta name="title" content="Tableland Explorer" />
                    <meta name="description" content="An explorer for Tableland Network." />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://tableland.xyz/" />
                    <meta property="og:title" content="Tableland Explorer" />
                    <meta property="og:description" content="An explorer for Tableland Network." />
                    <meta property="og:image" content={url} />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://tableland.xyz/" />
                    <meta property="twitter:title" content="Tableland Explorer" />
                    <meta property="twitter:description" content="An explorer for Tableland Network." />
                    <meta property="twitter:image" content={url} />
                </Head>
                <NavBar tableName={tableName} tableMetadata={tableMetadata} refresh={refresh} isLoading={refreshing || isValidating} />
                <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                    {
                       data?.message ? (
                            <Alert status='error'>
                                <AlertIcon />
                                {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                            </Alert>
                       ) : (
                            <Grid data={data} downloadFilename={tableName} />
                       )
                    }
                </chakra.div>
            </>
        )
    }

}

export default IdentitySection;
