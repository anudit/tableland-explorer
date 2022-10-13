import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Tag, Button, Text, useDisclosure, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import NavBar from '@/components/NavbarAddress';
import TableCard from '@/components/ExploreTableCard';
import Meta from '@/components/Meta';
import DetailsModal from '@/components/DetailsModal';
import { OpenseaIcon, TablelandSmallIcon } from '@/public/icons';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { getUserRigs } from '@/utils/rigs';
import RigCard from '@/components/RigCard';

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;
    const [activeModalData, setActiveModalData] = useState({});
    const [userRigs, setUserRigs] = useState(false);
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

    useEffect(()=>{
        if(address) getUserRigs(address).then(setUserRigs);
    },[address])

    useEffect(()=>{
        console.log('data', data);
    },[data])

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
            <Tabs>
                <TabList>
                    <Tab>Tables {data && (<Tag ml={2}>{data.map(e=>e?.data?.tables).flat().length}</Tag>)}</Tab>
                    <Tab>Rigs {userRigs && (<Tag ml={2}>{userRigs.length}</Tag>)}</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p={0}>
                        {
                            data ? data.map(e=>e?.data?.tables).flat().length != 0 ? (
                                    <Wrap
                                        spacing={{base: 0, md:3}}
                                        align='center'
                                        justify='center'
                                        m={{base: 0, md:8}}
                                        mt={{base: 4, md:8}}
                                    >
                                        {
                                            data
                                                .map(e=>e?.data?.tables)
                                                .flat()
                                                .sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})
                                                .map((table, oid) => (
                                                        <WrapItem key={oid}>
                                                            <TableCard tableName={table?.name} table={table} w={{base: '100%', md:'500px'}} infoClick={()=>{
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
                                <Flex w="100%" h="100vh" justifyContent='center' alignItems='center'>
                                    <Spinner />
                                </Flex>
                            )
                        }
                    </TabPanel>
                    <TabPanel p={0}>
                        {
                            Boolean(userRigs) === true ? userRigs.length>0 ? (
                                <Wrap
                                    spacing={{base: 0, md:3}}
                                    align='center'
                                    justify='center'
                                    m={{base: 0, md:8}}
                                    mt={16}
                                >
                                    {
                                        userRigs
                                            .map((rig) => (
                                                <WrapItem key={rig?.name}>
                                                    <RigCard id={rig?.token_id} image={rig?.thumb_alpha} w={{base: '100%', md:'500px'}} />
                                                </WrapItem>
                                            )
                                        )
                                    }
                                </Wrap>
                            ) : (
                                <Flex direction='column' alignItems='center' h="100%" w="100%" justifyContent='center'>
                                    <Text fontSize='xl' align='center' w={{base: '90%', md: "50%"}} mt={2}>
                                    Rigs is a generative collection built from 1,074 handcrafted works of art for the builders and creatives of cyberspace. Rigs are built on the Tableland protocol, a decentralized read, write, and own database for relational, composable data—powered by smart contracts and SQL on EVM chains like Ethereum. Rigs are your ticket to rewards for builders, creatives, ambassadors, and believers in Tableland.
                                    </Text>
                                    <br/>
                                    <Button variant="ghost" leftIcon={<OpenseaIcon />} rightIcon={<ExternalLinkIcon />} onClick={()=>{
                                        window.open('https://opensea.io/collection/tableland-rigs', '_blank');
                                    }}>
                                        Get on Opensea
                                    </Button>
                                </Flex>
                            ) : (
                                <Flex w="100%" h="100vh" justifyContent='center' alignItems='center'>
                                    <Spinner />
                                </Flex>
                            )
                        }
                    </TabPanel>
                </TabPanels>
                </Tabs>
                <DetailsModal tableMetadata={activeModalData} onClose={onClose} isOpen={isOpen}/>
            </chakra.div>
        </>
    )

}

export default UserSection;
