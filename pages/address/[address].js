import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip, IconButton, useColorMode, Box, Tag, Button, Text, useDisclosure, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import useSWR from "swr";

import { multifetch } from '@/utils/fetcher';
import TableCard from '@/components/ExploreTableCard';
import Meta from '@/components/Meta';
import DetailsModal from '@/components/DetailsModal';
import { EtherscanIcon, FeedIcon, OpenseaIcon, TableIcon, TablelandSmallIcon } from '@/public/icons';
import { getFeed, getUserRigs } from '@/utils/rigs';
import RigCard from '@/components/RigCard';
import RigAction from '@/components/RigAction';
import EnsAvatar from '@/components/EnsAvatar';
import AddressOrEns from '@/components/AddressOrEns';
import { EnsCacheContext } from '@/contexts/EnsCache';
import UniversalSearch from '@/components/UniversalSearch';
import { avatar, getImageDataURL } from '@/utils/stringUtils';

const UserSection = () => {

    const router = useRouter();
    const { address } = router.query;
    const [activeModalData, setActiveModalData] = useState({});
    const [userRigs, setUserRigs] = useState(false);
    const [feed, setFeed] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();
    const { ensToAddress } = useContext(EnsCacheContext);
    const [localEns, setLocalEns] = useState(false);

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
            ensToAddress(address).then(add=>setLocalEns(add));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Meta title={localEns ? `${localEns} - Tablescan` : false} />
            <UniversalSearch defaultValue={localEns || address }>
                <Tooltip hasArrow label={isValidating ? "Refreshing Data" : "Refresh Data"} placement='left'>
                    <IconButton
                        borderRadius='100%'
                        variant={'ghost'}
                        icon={isValidating ? <Spinner size="xs"/> : <RepeatIcon />}
                        disabled={isValidating}
                    />
                </Tooltip>
            </UniversalSearch>
            <Flex position="relative" height="calc(100vh - 50px)" width="100%" direction='column'>
                <Flex w="100%" direction='column' alignItems='center' mt='70px'>
                    <Flex
                        w={{base: "100%", md:"90%" }}
                        minHeight={{base:"150px" , md:"200px" }}
                        borderBottomRadius={30}
                        background={`url(${getImageDataURL(avatar('profile-'+address))})`}
                        backgroundBlendMode='color'
                        backgroundRepeat='no-repeat'
                        backgroundSize='cover'
                        backgroundPosition='center'
                    />
                    <Flex w={{base: "95%", md:"80%" }} mt={{base:'-50px', md:'-70px'}} justifyContent='space-between'>
                        <Flex direction='column'>
                            <EnsAvatar size={{base: "xl", md:"2xl"}} address={address} borderWidth='6px' borderColor={colorMode === 'dark' ? "black" : "white"}/>
                            <AddressOrEns address={address} fontWeight={900} fontSize="2xl" />
                        </Flex>
                        <Flex direction='row' mt={24}>
                            <Link href={`https://blockscan.com/address/${address}`} target="_blank">
                                <IconButton icon={<EtherscanIcon />} variant="ghost" />
                            </Link>
                        </Flex>
                    </Flex>
                </Flex>
                <Tabs  width="100%">
                    <TabList display='flex' justifyContent='center' borderBottomWidth='0.5px' borderBottomColor={colorMode === 'light' ? '#dfdfdf' : '#343333'}>
                        <Flex w={{base: "100%", md:"80%"}}>
                            <Tab>
                                <Box as='span' mr='2'> <FeedIcon /> </Box>
                                Feed
                            </Tab>
                            <Tab>
                                <Box as='span' mr='2'> <TableIcon /> </Box>
                                Tables {data && (<Tag ml={2} variant='outline' boxShadow='none'>{data.map(e=>e?.data?.tables).flat().length}</Tag>)}
                            </Tab>
                            <Tab>
                                <Box as='span' mr='2'>
                                    <TablelandSmallIcon
                                        color="transparent"
                                        strokeWidth='4px'
                                        stroke={colorMode == 'light' ? 'black' : 'white'}
                                    />
                                </Box>
                                Rigs {userRigs && (<Tag ml={2} variant='outline' boxShadow='none'>{userRigs.length}</Tag>)}
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
                                            <Link href='https://docs.tableland.xyz/build-a-dynamic-nft-in-solidity' target="_blank">
                                                <Button variant="ghost" leftIcon={<TablelandSmallIcon/>} rightIcon={<ExternalLinkIcon />}>
                                                    Tableland Docs
                                                </Button>
                                            </Link>
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
                                        spacing={{base: 0}}
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
                                                            mb={0}
                                                            borderRadius={0}
                                                            h={{base: 'calc(100vh - 100px)', md:'auto'}}
                                                        />
                                                    </WrapItem>
                                                )
                                            )
                                        }
                                    </Wrap>
                                ) : (
                                    <Flex direction='column' alignItems='center' h="calc(100vh - 160px)" p={2} w="100%" justifyContent='center' borderColor={colorMode === 'light' ? '#dfdfdf' : '#343333'}>
                                        <Text fontSize='xl' align='center' w={{base: '90%', md: "50%"}} mt={2}>
                                        Rigs is a generative collection built from 1,074 handcrafted works of art for the builders and creatives of cyberspace. Rigs are built on the Tableland protocol, a decentralized read, write, and own database for relational, composable data — powered by smart contracts and SQL on EVM chains like Ethereum. Rigs are your ticket to rewards for builders, creatives, ambassadors, and believers in Tableland.
                                        </Text>
                                        <br/>
                                        <Link href="https://opensea.io/collection/tableland-rigs" target="_blank">
                                            <Button variant="ghost" leftIcon={<OpenseaIcon />} rightIcon={<ExternalLinkIcon />}>
                                                Get on Opensea
                                            </Button>
                                        </Link>
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
            </Flex>
        </>
    )

}

export default UserSection;
