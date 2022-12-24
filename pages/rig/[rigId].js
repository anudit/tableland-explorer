import React, { useEffect, useState, useRef } from 'react';
import { Spinner, Avatar, chakra, Box, Tooltip, useColorMode, IconButton, Image, Button, Text, Heading, Flex, Wrap, WrapItem } from "@chakra-ui/react";

import Meta from '@/components/Meta';
import { EtherscanIcon, EthIcon, FlightLogIcon, FullscreenIcon, MetadataIcon, OpenseaIcon, ShareIcon } from '@/public/icons';
import { constructTokenURIQuery, getFlightData, getReservoirData } from '@/utils/rigs';
import AddressOrEns from '@/components/AddressOrEns';
import EnsAvatar from '@/components/EnsAvatar';
import { ArrowBackIcon, ArrowForwardIcon, WarningIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { cleanDecimals, countdown } from '@/utils/stringUtils';
import useSWR from 'swr';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
  } from '@chakra-ui/react'
import UniversalSearch from '@/components/UniversalSearch';
import { RepeatIcon } from '@chakra-ui/icons';

export async function getStaticPaths() {

    var paths = [];

    for (var i = 1; i <= 3000; i++) {
        paths.push({
            params: { rigId: String(i) }
        })
    }

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps(context) {
    const res = await getReservoirData(context.params.rigId);

    return {
      props: {
        pageData: res,
        rigId: context.params.rigId
      }
    }
}

const UserSection = ({pageData: propsData, rigId}) => {

    const {colorMode} = useColorMode();
    const imageRef = useRef();
    const { data: pageData, mutate, isValidating } = useSWR(rigId, getReservoirData, {
        fallbackData: propsData,
    });
    const [refreshing, setRefreshing] = useState(false);

    const [flights, setFlights] = useState(false);
    useEffect(()=>{
        getFlightData(rigId).then(({flightData, nftMetadatas, latestBlock})=>{
            setFlights({flightData, nftMetadatas, latestBlock})
        })
    }, [rigId]);

    async function refresh(){
        setRefreshing(true);
        let data = await getReservoirData(rigId, true);
        mutate(data);
        setRefreshing(false);
    }
    function getMeta(address){
        return flights?.nftMetadatas.filter(n=>n.contract.address.toLowerCase() === address.toLowerCase())[0];
    }

    return (
        <Flex direction='column' m="0" h="max-content">
            <Meta title={`Rig #${rigId} - Tablescan`} url={`https://tableland.mypinata.cloud/ipfs/bafybeidpnfh2zc6esvou3kfhhvxmy2qrmngrqczj7adnuygjsh3ulrrfeu/${rigId}/image_thumb.png`}/>
            <UniversalSearch>
                <Tooltip hasArrow label={refreshing || isValidating ? "Refreshing Data" : "Refresh Data"} placement='left'>
                    <IconButton variant="ghost" onClick={refresh} icon={refreshing || isValidating ? <Spinner size="xs"/> : <RepeatIcon />} disabled={refreshing || isValidating}/>
                </Tooltip>
            </UniversalSearch>
            <Flex flexDirection={{base: "column", md: "row"}} height="calc(100vh - 50px)" mt="50px">
                <Flex position='relative' ref={imageRef} h="100%" w={{base: '100%', md: '50%'}} alignItems="center" justifyContent='center' background='#80808014'>
                    <Flex direction="row" position='absolute' bottom='20px' right='20px' >
                        {parseInt(rigId) !=1 && (
                            <Link href={`/rig/${parseInt(rigId)-1}`} name="Previous Rig">
                                <IconButton mr={1} icon={<ArrowBackIcon />} borderRadius="100%"/>
                            </Link>
                        )}
                        {parseInt(rigId) != 3000 && (
                            <Link href={`/rig/${parseInt(rigId)+1}`} name="Next Rig">
                                <IconButton mr={1} icon={<ArrowForwardIcon />} borderRadius="100%"/>
                            </Link>
                        )}
                        <IconButton icon={<FullscreenIcon />} borderRadius="100%" onClick={()=>{
                            if (window.innerWidth == screen.width && window.innerHeight == screen.height){
                                document.exitFullscreen();
                            }
                            else {
                                imageRef.current.requestFullscreen();
                            }
                        }}/>
                    </Flex>
                    <Box
                        style={{
                            'aspectRatio': '1/1'
                        }}
                        width={{base: "300px", sm: "400px", md: "clamp(30em, 100%,48em)", lg:"600px"}}
                        height={{base: "300px", sm: "400px", md: "auto", lg:"auto"}}
                        shadow='dark-lg'
                    >
                        <chakra.iframe
                            title={rigId}
                            src={`https://rigs.tableland.xyz/${rigId}.html`}
                            width="100%"
                            height="100%"
                            scrolling="no"
                            allowtransparency="true"
                        />
                    </Box>

                </Flex>
                <Flex h="auto" direction='column' w={{base: '100%', md: '50%'}} justifyContent="center" alignItems='center'>
                    <Flex direction='column' p={8} w={{base: '100%', md: '90%'}}>
                        <Flex border="1px" borderRadius='5px' width="fit-content" px="8px" py="4px" borderColor={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'} mb={1}>
                            <Text fontSize="xs" mr={1} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>Rarity Rank</Text>
                            <Text fontSize="xs"> {pageData.token.rarityRank} / 3000 ({cleanDecimals(pageData.token.rarityRank/ 30)}%)</Text>
                        </Flex>
                        <Heading mb={{base: 4, md: 4}} size="3xl" mt={{base: 4, md: 0}} display="flex" alignItems='center'>
                            Rig #{rigId} {pageData.token.isFlagged && <Tooltip label="This Item is reported suspicious and not tradable on OpenSea" placement='top-start' hasArrow backgroundColor='red.500'><WarningIcon color="red.500" boxSize={8} ml={4}/></Tooltip>}
                        </Heading>
                        <Flex direction={{base:'column', lg: 'row'}} align="left" my={4}>
                            <Flex direction='row' mr={4} alignItems="center" mb={{base:4, lg:0}}>
                                <EnsAvatar size="sm" address={pageData.token.owner} />
                                <Flex direction='column'>
                                    <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                        Owner
                                    </Text>
                                    <AddressOrEns
                                        address={pageData.token.owner}
                                        tooltip={false}
                                        cursor="pointer"
                                        ml={2}
                                    />
                                </Flex>
                            </Flex>
                            <Flex direction='row' mr={4}>
                                {
                                    Boolean(pageData.token.lastBuy.value) && (
                                        <Flex direction='row' alignItems="center" mr={{base: 8, md: 4}}>
                                            <EthIcon boxSize={8} />
                                            <Flex direction='column'>
                                                <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                    Last Sale
                                                </Text>
                                                <Text ml={2} fontWeight={400} size={{base: 'sm', md: 'md'}}>
                                                    {pageData.token.lastBuy.value.toFixed(4)}{" ETH"}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                                {
                                    Boolean(pageData.market.topBid?.id) && (
                                        <Link href={pageData.market.topBid.source.url} target="_blank">
                                            <Flex direction='row' alignItems="center">
                                                <Image src={pageData.market.topBid.source.icon} height={8} width={8} title={pageData.market.topBid.source.name} />
                                                <Flex direction='column'>
                                                    <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                        Highest Offer
                                                    </Text>
                                                    <Text ml={2} fontWeight={400} size={{base: 'sm', md: 'md'}}>
                                                        {pageData.market.topBid.price.amount.native}
                                                        {" " + pageData.market.topBid.price.currency.symbol}
                                                        {" "}
                                                        (${cleanDecimals(pageData.market.topBid.price.amount.usd)})
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Link>
                                    )
                                }
                            </Flex>
                        </Flex>
                        <Accordion defaultIndex={[0]} allowMultiple>
                            <AccordionItem borderRadius="10px" borderWidth="1px" borderColor={colorMode === 'light' ? '#0000001a' : '#ffffff1a'}>
                                <AccordionButton
                                    background={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
                                    _hover={{
                                        'background': colorMode === 'light' ? 'gray.300' : 'whiteAlpha.200'
                                    }}
                                    borderRadius="10px"
                                    _expanded={{
                                        'borderBottomRadius': 0
                                    }}
                                    py={4}
                                    px={6}
                                >
                                    <Box flex='1' textAlign='left' alignItems='center' display="flex">
                                        <MetadataIcon mr={2}/> Attributes
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <Wrap mt={2}>
                                        {
                                            pageData.token.attributes.sort((a, b)=>String(a.key).toLowerCase().charCodeAt(0) - String(b.key).toLowerCase().charCodeAt(0)).map(e=>(
                                                <WrapItem key={e?.key}>
                                                    <Flex
                                                        direction="column"
                                                        backgroundColor='hsl(201deg 94% 60% / 11%)'
                                                        borderColor="blue.500"
                                                        borderWidth="1px"
                                                        borderRadius="10px"
                                                        p={2}
                                                    >
                                                        <Text fontSize='x-small' letterSpacing='1px'  mb={1} textTransform='uppercase' color="blue.500">
                                                            {e?.key}
                                                        </Text>
                                                        <Text fontSize='sm' fontWeight={600}>{e?.value}</Text>
                                                        <Text title={`${e?.tokenCount} Other rigs also have this trait`} fontSize='x-small' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>{e?.tokenCount} ({cleanDecimals(e?.tokenCount/30)}%)</Text>
                                                    </Flex>
                                                </WrapItem>
                                                )
                                            )
                                        }
                                    </Wrap>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem borderRadius="10px" borderWidth="1px" mt={2} borderColor={colorMode === 'light' ? '#0000001a' : '#ffffff1a'}>
                                <AccordionButton
                                    background={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
                                    _hover={{
                                        'background': colorMode === 'light' ? 'gray.300' : 'whiteAlpha.200'
                                    }}
                                    borderRadius="10px"
                                    _expanded={{
                                        'borderBottomRadius': 0
                                    }}
                                    py={4}
                                    px={6}
                                >
                                    <Box flex='1' textAlign='left' alignItems='center' display="flex">
                                        <FlightLogIcon mr={2}/> Flight Log
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <TableContainer>
                                        {flights ? flights.flightData.length > 0 ? (
                                            <Table size='sm'>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Pilot</Th>
                                                        <Th>Status</Th>
                                                        <Th>Flight Time</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        flights.flightData.sort((a, b)=>b.startTime - a.startTime).map(e=>(
                                                            <Tr key={e.startTime}>
                                                                <Td>{e.contract ? Boolean(getMeta(e.contract)) === true ? (
                                                                    <Link href={'https://opensea.io/assets/ethereum/'+e.contract+'/'+getMeta(e.contract).id.tokenId} target="_blank">
                                                                        <Flex alignItems="center">
                                                                            <Avatar size="xs" borderRadius="0" src={getMeta(e.contract).media[0].gateway} mr={2}/>
                                                                            <Text>{getMeta(e.contract).title}</Text>
                                                                        </Flex>
                                                                    </Link>
                                                                ) : <AddressOrEns address={e.contract} m={0}/> : "Trainer"}</Td>
                                                                <Td>{e.endTime ? "Landed" : "In-flight"}</Td>
                                                                <Td>{e.endTime ? "~" + countdown(12.07*parseInt(e.endTime - e.startTime)) : countdown(12.07*parseInt(flights.latestBlock - e.startTime))}</Td>
                                                            </Tr>
                                                        ))
                                                    }
                                                </Tbody>
                                            </Table>
                                        ) : (<Text>No Flights</Text>) : (<Spinner />)
                                        }
                                    </TableContainer>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        <br/>
                        <Flex direction="row" alignItems='flex-start'>
                            <Link href={`https://opensea.io/assets/ethereum/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${rigId}`} target="_blank">
                                <Button variant='ghost' leftIcon={<OpenseaIcon />} mb={1} w="fit-content">View on Opensea</Button>
                            </Link>
                            <Link href={`https://etherscan.io/nft/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${rigId}`} target="_blank">
                                <Button variant='ghost' leftIcon={<EtherscanIcon />} mb={1} w="fit-content">View on Etherscan</Button>
                            </Link>
                        </Flex>
                        <Flex direction="row" alignItems='flex-start'>
                            <Link href={constructTokenURIQuery(rigId)} target="_blank">
                                <Button variant='ghost' leftIcon={<MetadataIcon />} mb={1} w="fit-content">View Metadata</Button>
                            </Link>
                            <Button variant='ghost' leftIcon={<ShareIcon />} mb={1} w="fit-content" onClick={()=>{
                                const shareData = {
                                    title: `Tableland - Rig #${rigId}`,
                                    text: `Checkout Rig #${rigId} on Tablescan`,
                                    url: `https://tablescan.io/rig/${rigId}`
                                }
                                if (navigator && navigator.share) navigator.share(shareData)
                            }}>
                                Share Link
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )

}

export default UserSection;
