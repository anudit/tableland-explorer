import React from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Grid } from "@githubocto/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import NavBar from '../components/Navbar';

const IdentitySection = () => {

    const router = useRouter();
    const { tableName } = router.query;

    const { data, error } = useSWR(
        tableName ? [`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`] : null,
        fetcher
    );

    if (error) return <div>failed to load</div>;
    if (!data) return (
        <Flex alignContent="center" direction="column" height="100vh" width="100vw">
            <Spinner />
        </Flex>
    );

    if (data?.message){
        return (
            <>
                <NavBar tableName={tableName}/>
                <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                    <Alert status='error'>
                        <AlertIcon />
                        {data?.message}
                    </Alert>
                </chakra.div>
            </>
        )
    }
    else {
        return (
            <>
                <NavBar tableName={tableName}/>
                <chakra.div position="relative" height="calc(100vh - 50px)">
                    <Grid data={data} downloadFilename={tableName}/>
                </chakra.div>
            </>
        )
    }

}

export default IdentitySection;
