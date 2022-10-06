import React from 'react';
import { Text, chakra } from "@chakra-ui/react";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import Meta from '@/components/Meta';

const Explore = () => {

    const { error } = useSWR(
        [`https://testnet.tableland.network/query?mode=json&s=`],
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    if (error) return <div>failed to load, {error}</div>;
    return (
        <>
            <Meta />
            <Text>Explore</Text>
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                yo
            </chakra.div>
        </>
    )

}

export default Explore;
