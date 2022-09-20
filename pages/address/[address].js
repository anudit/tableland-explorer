import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import NavBar from '../../components/Navbar2';
import TableCard from '@/components/TableCard';
import Meta from '@/components/Meta';

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

    return (
        <>
            <Meta />
            <NavBar address={address} isLoading={isValidating} />
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                {
                    data ? data?.message ? (
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
                    : ( <Flex w="100vw" h="100vh" justifyContent='center' alignItems='center'>
                        <Spinner />
                    </Flex> )

                }
            </chakra.div>
        </>
    )

}

export default UserSection;
