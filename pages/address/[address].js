import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { InputRightElement, InputGroup, Input, ButtonGroup, Tooltip, IconButton, Link, useColorMode, Box, Tag, Button, Text, useDisclosure, chakra, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import TableCard from '@/components/ExploreTableCard';
import Meta from '@/components/Meta';
import DetailsModal from '@/components/DetailsModal';
import { FeedIcon, OpenseaIcon, TableIcon, TablelandSmallIcon } from '@/public/icons';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { getFeed, getUserRigs } from '@/utils/rigs';
import RigCard from '@/components/RigCard';
import RigAction from '@/components/RigAction';
import EnsAvatar from '@/components/EnsAvatar';
import AddressOrEns from '@/components/AddressOrEns';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { MoonIcon } from '@chakra-ui/icons';
import { RepeatIcon } from '@chakra-ui/icons';
import { SunIcon } from '@chakra-ui/icons';
import { TablelandIcon } from 'out/icons';
import { CloseIcon } from '@chakra-ui/icons';
import { EnsCacheContext } from '@/contexts/EnsCache';
import { isAddress } from "ethers/lib/utils";

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;
    const [activeModalData, setActiveModalData] = useState({});
    const [userRigs, setUserRigs] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feed, setFeed] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const inpRef = useRef(null);
    const { ensToAddress, lensToAddress } = useContext(EnsCacheContext);

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
                    }).sort((a, b)=>{
                        return new Date(b?.transaction_date) - new Date(a?.transaction_date)
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
            <Flex
                as="nav"
                justify="space-between"
                alignItems='center'
                w="100%"
                py={2}
                px={4}
                height="100px"
                top="0"
            >
                <Flex direction="row" justify="center" w={{base: "100%", md:"9%"}} display={{base: "none", md: "flex"}} alignItems="center">
                    <Link href="/">
                        <TablelandIcon cursor="pointer" width="120px" _hover={{color: '#326cfc'}}/>
                    </Link>
                </Flex>
                <Flex direction="row" justify="left" w={{base: "100%", md:"80%"}}>
                    <InputGroup size='sm' alignItems="center" w={{base: "100%", md:"60%"}}>
                        <InputRightElement width='4.5rem'>
                            <IconButton size="md" mt={3} variant='unstyled' icon={<CloseIcon />} h='1.75rem' onClick={()=>{
                                inpRef.current.value = ""
                            }} />
                        </InputRightElement>
                        <Input
                            size="lg"
                            shadow='lg'
                            defaultValue={address}
                            ref={inpRef}
                            disabled={loading}
                            placeholder="Search for an Address or Ens Name"
                            onKeyDown={(e)=>{
                                let searchValue = e.currentTarget.value;
                                if(e.code == 'Enter'){
                                  if (isAddress(searchValue)) router.push(`/address/${searchValue}`);
                                  if (searchValue.endsWith('.eth')) {
                                    setLoading(true);
                                    ensToAddress(searchValue).then(res=>{
                                      if (isAddress(res)) router.push(`/address/${res}`)
                                    }).finally(()=>{
                                        setLoading(false);
                                    })
                                  }
                                  if (searchValue.endsWith('.lens')) {
                                    setLoading(true);
                                    lensToAddress(searchValue).then(res=>{
                                      if (isAddress(res)) router.push(`/address/${res}`)
                                    }).finally(()=>{
                                        setLoading(false);
                                    })
                                  }
                                }
                            }}
                        />
                    </InputGroup>
                </Flex>
                <Flex direction="row" justify="right" alignItems='center' w={{base: "fit-content", md:"10%"}} align='right'>
                    <ButtonGroup size='sm' isAttached variant='ghost'>
                        <Tooltip hasArrow label={isValidating ? "Refreshing Data" : "Refresh Data"} placement='left'>
                            <IconButton icon={isValidating ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isValidating}/>
                        </Tooltip>
                        <IconButton onClick={toggleColorMode}  icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />} />
                    </ButtonGroup>
                </Flex>
            </Flex>
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                <Tabs colorScheme='messenger'>
                    <TabList display='flex' justifyContent='center' borderBottomWidth='0.5px'>
                        <Flex w={{base: "100%", md:"80%"}}>
                            <Tab>
                                <Box as='span' mr='2'> <FeedIcon /> </Box>
                                Feed
                            </Tab>
                            <Tab>
                                <Box as='span' mr='2'> <TableIcon /> </Box>
                                Tables {data && (<Tag ml={2}>{data.map(e=>e?.data?.tables).flat().length}</Tag>)}
                            </Tab>
                            <Tab>
                                <Box as='span' mr='2'> <TablelandSmallIcon /> </Box>
                                Rigs {userRigs && (<Tag ml={2}>{userRigs.length}</Tag>)}
                            </Tab>
                        </Flex>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={0} justifyContent="center" display="flex">
                            <Flex
                                direction={{base: 'column-reverse', md: "row"}}
                                alignItems='start'
                                justifyContent={{base: 'start', md:'space-between'}}
                                minH="calc(100vh - 50px)"
                                w={{base: "100%", md:"80%"}}
                            >
                                <Flex direction="column" width={{base: "100%", md: "60%"}} align="start">
                                    {
                                        Boolean(feed) && feed.length > 0 ? feed.map((item, oid)=>(
                                            <RigAction
                                                data={item}
                                                key={oid}
                                                mt={4}
                                                position="relative"
                                                backgroundColor={null}
                                                whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis"
                                            />
                                        )) : (
                                            <Text fontSize="md" mt={2} align="left">No activity found.</Text>
                                        )
                                    }
                                </Flex>
                                <Flex direction="column" width={{base: "100%", md: "30%"}} align="center" borderWidth="1px" mt={4}>
                                    <EnsAvatar size="lg" address={address} />
                                    <AddressOrEns address={address} tooltip={false}/>
                                    <Tooltip hasArrow label='View on Etherscan' placement='left'>
                                        <IconButton onClick={()=>{
                                            window.open(`https://blockscan.com/address/${address}`, "_blank");
                                        }} icon={<ArrowUpIcon style={{'transform':'rotate(45deg)'}}/>} />
                                    </Tooltip>
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
                                                        <RigCard
                                                            id={rig?.token_id}
                                                            image={rig?.thumb_alpha}
                                                            w={{base: '100%', md:'500px'}}
                                                        />
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
