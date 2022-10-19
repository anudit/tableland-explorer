import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Heading, Tag, Button, Text, useDisclosure, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import NavBar from '@/components/NavbarAddress';
import TableCard from '@/components/ExploreTableCard';
import Meta from '@/components/Meta';
import DetailsModal from '@/components/DetailsModal';
import { OpenseaIcon, TablelandSmallIcon } from '@/public/icons';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { getFeed, getUserRigs } from '@/utils/rigs';
import RigCard from '@/components/RigCard';
import RigAction from '@/components/RigAction';

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;
    const [activeModalData, setActiveModalData] = useState({});
    const [userRigs, setUserRigs] = useState(false);
    const [feed, setFeed] = useState(false);
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
        if(address) {
            getUserRigs(address).then(setUserRigs);
            getFeed(address).then((f)=>{
                if (f && f?.filter){
                    let needed = f.filter(d=>{
                        return d?.contract_address?.toLowerCase() == '0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d' || d?.nft?.contract_address?.toLowerCase() == '0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d'
                    });
                    console.log('feed', needed);
                    setFeed(needed)
                }
            });
        }
    },[address])

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
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%" mt={12}>
            <Tabs>
                <TabList borderBottom='none'>
                    <Tab>Feed</Tab>
                    <Tab>Tables {data && (<Tag ml={2}>{data.map(e=>e?.data?.tables).flat().length}</Tag>)}</Tab>
                    <Tab>Rigs {userRigs && (<Tag ml={2}>{userRigs.length}</Tag>)}</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p={0}>
                        <Flex direction={{base: 'column', md: "row"}} alignItems='start' justifyContent='center' minH="calc(100vh - 50px)" p={2} w={{base: "100%", md:"80%"}}>
                            <Flex direction="column" position='sticky' alignItems={{base: 'flex-start', md:'flex-end'}} width={{base: "100%", md: "30%", lg: "40%"}}>
                                <Heading m={4} size='2xl'>
                                    Feed
                                </Heading>
                            </Flex>
                            <Flex direction="column" width={{base: "100%", md: "70%", lg: "50%"}} align="center">
                                {
                                    Boolean(feed) && feed.length > 0 ? feed.map((item, oid)=>(
                                        <RigAction data={item} key={oid} mb={2} position="relative"/>
                                    )) : (
                                        <Text m={6} fontSize="2xl">Crickets 🦗</Text>
                                    )
                                }
                            </Flex>
                        </Flex>
                    </TabPanel>
                    <TabPanel p={0}>
                        {
                            data ? data.map(e=>e?.data?.tables).flat().length != 0 ? (
                                    <Wrap
                                        spacing={{base: 0, md:3}}
                                        align='center'
                                        justify='center'
                                        m={{base: 0, md:8}}
                                        mt={{base: 0, md:8}}
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
                                    <Flex direction='column' alignItems='center' h="calc(100vh - 160px)" p={2} w="100%" justifyContent='center'>
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
                                    scrollSnapType='y mandatory'
                                    style={{
                                        "&.proximity" : {
                                            scrollSnapType: "y proximity"
                                        }
                                    }}
                                >
                                    {
                                        userRigs
                                            .map((rig) => (
                                                <WrapItem key={rig?.name} scrollSnapAlign='start'>
                                                    <RigCard id={rig?.token_id} image={rig?.thumb_alpha} w={{base: '100%', md:'500px'}} />
                                                </WrapItem>
                                            )
                                        )
                                    }
                                </Wrap>
                            ) : (
                                <Flex direction='column' alignItems='center' h="calc(100vh - 160px)" p={2} w="100%" justifyContent='center'>
                                    <Text fontSize='xl' align='center' w={{base: '90%', md: "50%"}} mt={2}>
                                    Rigs is a generative collection built from 1,074 handcrafted works of art for the builders and creatives of cyberspace. Rigs are built on the Tableland protocol, a decentralized read, write, and own database for relational, composable data — powered by smart contracts and SQL on EVM chains like Ethereum. Rigs are your ticket to rewards for builders, creatives, ambassadors, and believers in Tableland.
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
