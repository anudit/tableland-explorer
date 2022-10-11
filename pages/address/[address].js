import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Text, useDisclosure, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import NavBar from '@/components/NavbarAddress';
import TableCard from '@/components/ExploreTableCard';
import Meta from '@/components/Meta';
import DetailsModal from '@/components/DetailsModal';
import { TablelandSmallIcon } from '@/public/icons';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;
    const [activeModalData, setActiveModalData] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data, error, isValidating } = useSWR(address ? `{
        tables(where: {owner: "${address.toLowerCase()}"}, orderBy: created, orderDirection: desc) {
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
        }
    }`: null, multifetch);

    if (error) return (
        <div>failed to load, {error}</div>
    );

    function infoClick(id){
        setActiveModalData(data.map(e=>e?.data?.tables).flat().sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})[id]);
        onOpen();
    }

    return (
        <>
            <Meta />
            <NavBar address={address} isLoading={isValidating} />
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%" mt={16}>
                <DetailsModal tableMetadata={activeModalData} onClose={onClose} isOpen={isOpen}/>
                {
                    data ? data.map(e=>e?.data?.tables).flat().length != 0 ? (
                            <Wrap
                                spacing={{base: 0, md:3}}
                                align='center'
                                justify='center'
                                m={{base: 0, md:8}}
                                mt={16}
                            >
                                {
                                    data
                                        .map(e=>e?.data?.tables)
                                        .flat()
                                        .sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})
                                        .map((table, oid) => (
                                                <WrapItem key={oid}>
                                                    <TableCard tableName={table?.name} table={table} infoClick={()=>{
                                                        infoClick(oid)
                                                    }}/>
                                                </WrapItem>
                                            )
                                        )
                                }
                            </Wrap>
                        ) : (
                            <Flex direction='column' alignItems='center' h="100%" w="100%" justifyContent='center'>
                                <Text fontSize='xl' align='center'>
                                    You seem to have found a land with no Tables. <br/>Learn how to Create one on Tableland Docs.
                                </Text>
                                <br/>
                                <Button variant="ghost" leftIcon={<TablelandSmallIcon/>} rightIcon={<ExternalLinkIcon />} onClick={()=>{
                                    window.open('https://docs.tableland.xyz/build-a-dynamic-nft-in-solidity', '_blank');
                                }}>
                                    Tableland Docs
                                </Button>
                            </Flex>
                        )
                    : (
                        <Flex w="90vw" h="100vh" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )

                }
            </chakra.div>
        </>
    )

}

export default UserSection;
