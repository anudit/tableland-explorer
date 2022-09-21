import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDisclosure, Alert, AlertIcon, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import NavBar from '@/components/NavbarAddress';
import TableCard from '@/components/TableCard';
import Meta from '@/components/Meta';
import DetailsModal from '@/components/DetailsModal';

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;
    const [activeModalData, setActiveModalData] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data, error, isValidating } = useSWR(address ? `{
        tables(where: {owner: "${address.toLowerCase()}"}, orderBy: created, orderDirection: desc) {
            id
            name
            owner
            tableId
            statement
            tokenURI
            created
        }
    }`: null, multifetch);

    if (error) return (
        <div>failed to load, {error}</div>
    );

    function infoClick(id){
        setActiveModalData(data.map(e=>e?.data?.tables).flat()[id]);
        onOpen();
    }

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
                            <>
                                <Wrap spacing={3} align='center' justify='center' m={8} mt={16}>
                                    <DetailsModal tableMetadata={activeModalData} onClose={onClose} isOpen={isOpen}/>
                                    {
                                        data && data.map(e=>e?.data?.tables).flat().map((table, oid) => {
                                            return (
                                                <WrapItem key={oid}>
                                                    <TableCard tableName={table.name} infoClick={()=>{
                                                        infoClick(oid)
                                                    }}/>
                                                </WrapItem>
                                            )
                                        })
                                    }
                                </Wrap>
                                <br/><br/>
                            </>
                        )
                    : (
                        <Flex w="100vw" h="100vh" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )

                }
            </chakra.div>
        </>
    )

}

export default UserSection;
