import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import NavBar from '../../components/Navbar2';
import Head from 'next/head';
import TableCard from '@/components/TableCard';

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;

    const { data, error, isValidating } = useSWR(address ? `{
        tables(where: {owner: "${address.toLowerCase()}"}) {
          name
          owner
          tableId
        }
    }`: null, multifetch);

    useEffect(()=>{
        console.log(error, data);
    },[error, data])

    if (error) return (
        <div>failed to load, {error}</div>
    );

    if (!data) return (
        <Flex alignContent="center" direction="column" height="100vh" width="100vw">
            <Spinner />
        </Flex>
    )
    else {
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
                    <meta property="og:image" content="https://i.imgur.com/5ErjwNI.png" />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://tableland.xyz/" />
                    <meta property="twitter:title" content="Tableland Explorer" />
                    <meta property="twitter:description" content="An explorer for Tableland Network." />
                    <meta property="twitter:image" content="https://i.imgur.com/5ErjwNI.png" />
                </Head>
                <NavBar address={address} isLoading={isValidating} />
                <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                    {
                       data?.message ? (
                            <Alert status='error'>
                                <AlertIcon />
                                {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                            </Alert>
                       ) : (
                            <Wrap spacing={3} align='center' justify='center' m={8} mt={16}>
                                {
                                    data && data.map(e=>e?.data?.tables).flat().map((table, oid) => {
                                        return (
                                            <WrapItem key={oid}>
                                                <TableCard tableName={table.name} />
                                            </WrapItem>
                                        )
                                    })
                                }
                            </Wrap>
                       )
                    }
                </chakra.div>
            </>
        )
    }

}

export default UserSection;
