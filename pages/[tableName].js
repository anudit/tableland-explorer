import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Grid } from "@githubocto/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import NavBar from '../components/Navbar';
import { nameToSubgraph, nameToTime, parseTableData } from '@/utils/stringUtils';
import Meta from '@/components/Meta';

const IdentitySection = () => {

    const router = useRouter();
    const { tableName } = router.query;
    const [refreshing, setRefreshing] = useState(false);
    const [tableMetadata, setTableMetadata] = useState(false);

    const { data, error, mutate, isValidating } = useSWR(
        tableName ? [`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`] : null,
        fetcher,
        { refreshInterval: tableName? nameToTime(tableName) : 10000, revalidateOnFocus: true }
    );

    useEffect(()=>{
        async function run(){
            if (tableName){
                let subgraph = nameToSubgraph(tableName);
                if (subgraph){
                    let data = await fetcher(subgraph, "POST", {
                        query: `
                            query {
                                tables(where: {name: "${tableName}"}, first: 1) {
                                    id
                                    name
                                    owner {
                                        id
                                    }
                                    tableId
                                    statement
                                    tokenURI
                                    created
                                    txnHash
                                    controller {
                                        id
                                    }
                                    historyCount
                                    history {
                                        id
                                        statement
                                        time
                                    }
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

    let {tableId, chainId} = parseTableData(tableName);
    const url = `https://render.tableland.xyz/${chainId}/${tableId}`;
    return (
        <>
            <Meta url={url} />
            <NavBar tableName={tableName || ""} tableMetadata={tableMetadata} refresh={refresh} isLoading={refreshing || isValidating} />
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                {
                    data ? data?.message ? (
                        <Alert status='error'>
                            <AlertIcon />
                            {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                        </Alert>
                    ) : (
                        <Grid data={data} downloadFilename={tableName} />
                    ) : (
                        <Flex w="100vw" h="100vh" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
            </chakra.div>
        </>
    )

}

export default IdentitySection;
