import React, { useEffect, useState, useRef } from 'react';
import { Spinner, Avatar, chakra, Stack, Box, Tooltip, useColorMode, IconButton, Image, Button, Text, Heading, Flex, Wrap, WrapItem } from "@chakra-ui/react";

import { EtherscanIcon, EthIcon, FlightLogIcon, FullscreenIcon, MetadataIcon, OpenseaIcon, ShareIcon } from '@/public/icons';
import { constructTokenURIQuery, getFlightData, getReservoirData } from '@/utils/rigs';
import AddressOrEns from '@/components/AddressOrEns';
import EnsAvatar from '@/components/EnsAvatar';
import { ArrowBackIcon, ArrowForwardIcon, WarningIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { cleanDecimals, countdown } from '@/utils/stringUtils';
import useSWR from 'swr';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons';
import PageShell from '@/components/PageShell';

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

const UserSection = ({ pageData: propsData, rigId }) => {

  const { colorMode } = useColorMode();
  const imageRef = useRef();
  const { data: pageData, mutate, isValidating } = useSWR(rigId, getReservoirData, {
    fallbackData: propsData,
  });
  const [refreshing, setRefreshing] = useState(false);

  const [flights, setFlights] = useState(false);
  useEffect(() => {
    getFlightData(rigId).then((data) => {
      setFlights(data)
      console.log(data);
    })
  }, [rigId]);

  async function refresh() {
    setRefreshing(true);
    let data = await getReservoirData(rigId, true);
    mutate(data);
    setRefreshing(false);
  }
  function getMeta(address) {
    return flights?.nftMetadatas.filter(n => n.contract.address.toLowerCase() === address.toLowerCase())[0];
  }

  return (
    <PageShell title={`Rig #${rigId} - Tablescan`} url={`https://tableland.mypinata.cloud/ipfs/bafybeidpnfh2zc6esvou3kfhhvxmy2qrmngrqczj7adnuygjsh3ulrrfeu/${rigId}/image_thumb.png`}
      searchProps={{
        "children": (
          <Tooltip hasArrow label={refreshing || isValidating ? "Refreshing Data" : "Refresh Data"} placement='left'>
            <IconButton borderRadius='100%' variant="ghost" onClick={refresh} icon={refreshing || isValidating ? <Spinner size="xs" /> : <RepeatIcon />} disabled={refreshing || isValidating} />
          </Tooltip>
        )
      }}
    >
      <Flex flexDirection={{ base: "column", md: "row" }} height="calc(100vh - 50px)" mt={{ base: "70px", md: "50px" }} w="100%">
        <Flex position='relative' ref={imageRef} h="100%" w={{ base: '100%', md: '50%' }} alignItems="center" justifyContent='center' background='#80808014'>
          <Flex direction="row" position='absolute' bottom='20px' right='20px' >
            {parseInt(rigId) != 1 && (
              <Link href={`/rig/${parseInt(rigId) - 1}`} name="Previous Rig">
                <IconButton mr={1} icon={<ArrowBackIcon />} borderRadius="100%" />
              </Link>
            )}
            {parseInt(rigId) != 3000 && (
              <Link href={`/rig/${parseInt(rigId) + 1}`} name="Next Rig">
                <IconButton mr={1} icon={<ArrowForwardIcon />} borderRadius="100%" />
              </Link>
            )}
            <IconButton icon={<FullscreenIcon />} borderRadius="100%" onClick={() => {
              if (window.innerWidth == screen.width && window.innerHeight == screen.height) {
                document.exitFullscreen();
              }
              else {
                imageRef.current.requestFullscreen();
              }
            }} />
          </Flex>
          <Box
            style={{
              'aspectRatio': '1/1'
            }}
            width={{ base: "300px", sm: "400px", md: "clamp(30em, 100%,48em)", lg: "600px" }}
            height={{ base: "300px", sm: "400px", md: "auto", lg: "auto" }}
            shadow='dark-lg'
          >
            <chakra.iframe
              title={rigId}
              width="100%"
              height="100%"
              scrolling="no"
              allowtransparency="true"
              src={`https://rigs.tableland.xyz/${rigId}`}
            />
          </Box>

        </Flex>
        <Flex h="auto" direction='column' w={{ base: '100%', md: '50%' }} justifyContent="center" alignItems='center'>
          <Flex direction='column' p={8} w={{ base: '100%', md: '90%' }}>
            <Flex border="1px" borderRadius='5px' width="fit-content" px="8px" py="4px" borderColor={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'} mb={1}>
              <Text fontSize="xs" mr={1} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>Rarity Rank</Text>
              <Text fontSize="xs"> {pageData.token.rarityRank} / 3000 ({cleanDecimals(pageData.token.rarityRank / 30)}%)</Text>
            </Flex>
            <Heading mb={{ base: 4, md: 4 }} size="2xl" mt={{ base: 4, md: 0 }} display="flex" alignItems='center'>
              Rig #{rigId} {pageData.token.isFlagged && <Tooltip label="This Item is reported suspicious and not tradable on OpenSea" placement='top-start' hasArrow backgroundColor='red.500'><WarningIcon color="red.500" boxSize={8} ml={4} /></Tooltip>}
            </Heading>
            <Flex direction={{ base: 'column', lg: 'row' }} align="left" my={4}>
              <Flex direction='row' mr={4} alignItems="center" mb={{ base: 4, lg: 0 }}>
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
              <Stack direction="row" spacing='24px'>
                {
                  Boolean(pageData.token.lastSell.value) && (
                    <Flex direction='row' alignItems="center" mr={{ base: 8, md: 4 }}>
                      <EthIcon boxSize={8} />
                      <Flex direction='column'>
                        <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                          Last Sale
                        </Text>
                        <Text ml={2} fontWeight={400} size={{ base: 'sm', md: 'md' }}>
                          {pageData.token.lastSell.value.toFixed(4)}{" ETH"}
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
                          <Text ml={2} fontWeight={400} size={{ base: 'sm', md: 'md' }}>
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
                {
                  Boolean(pageData.market.floorAsk?.id) && (
                    <Link href={pageData.market.floorAsk.source.url} target="_blank">
                      <Flex direction='row' alignItems="center">
                        <Image src={pageData.market.floorAsk.source.icon} height={8} width={8} title={pageData.market.floorAsk.source.name} />
                        <Flex direction='column'>
                          <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                            Listed for
                          </Text>
                          <Text ml={2} fontWeight={400} size={{ base: 'sm', md: 'md' }}>
                            {pageData.market.floorAsk.price.amount.native}
                            {" " + pageData.market.floorAsk.price.currency.symbol}
                            {" "}
                            (${cleanDecimals(pageData.market.floorAsk.price.amount.usd)})
                          </Text>
                        </Flex>
                      </Flex>
                    </Link>
                  )
                }
              </Stack>
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
                    <MetadataIcon mr={2} /> Attributes
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Wrap mt={2}>
                    {
                      pageData.token.attributes.sort((a, b) => String(a.key).toLowerCase().charCodeAt(0) - String(b.key).toLowerCase().charCodeAt(0)).map(e => (
                        <Link href={`/attributes?search=${e?.value}`} key={e?.key}>
                          <WrapItem >
                            <Flex
                              direction="column"
                              backgroundColor='hsl(201deg 94% 60% / 11%)'
                              borderColor="blue.500"
                              borderWidth="1px"
                              borderRadius="10px"
                              p={2}
                            >
                              <Text fontSize='x-small' letterSpacing='1px' mb={1} textTransform='uppercase' color="blue.500">
                                {e?.key}
                              </Text>
                              <Text fontSize='sm' fontWeight={600}>{e?.value}</Text>
                              <Text title={`${e?.tokenCount} Other rigs also have this trait`} fontSize='x-small' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>{e?.tokenCount} ({cleanDecimals(e?.tokenCount / 30)}%)</Text>
                            </Flex>
                          </WrapItem>
                        </Link>
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
                    <FlightLogIcon mr={2} /> Flight Log
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <TableContainer>
                    {flights && flights.flightData ? flights.flightData.length > 0 ? (
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
                            flights.flightData.sort((a, b) => b.start_time - a.start_time).map(e => (
                              <Tr key={e.start_time}>
                                <Td>{e.pilot_contract != null ? Boolean(getMeta(e.pilot_contract)) === true ? (
                                  <Link href={'https://opensea.io/assets/ethereum/' + e.pilot_contract + '/' + getMeta(e.pilot_contract).id.tokenId} target="_blank">
                                    <Flex alignItems="center">
                                      <Avatar size="xs" borderRadius="0" src={getMeta(e.pilot_contract).media[0].gateway} mr={2} />
                                      <Text>{getMeta(e.pilot_contract).title}</Text>
                                    </Flex>
                                  </Link>
                                ) : <AddressOrEns address={e.pilot_contract} m={0} /> : "Trainer"}</Td>

                                <Td>{e.end_time != null ? "Landed" : "In-flight"}</Td>
                                <Td>{e.end_time != null ? "~" + countdown(12.07 * parseInt(e.end_time - e.start_time)) : countdown(12.07 * parseInt(flights.latestBlock - e.start_time))}</Td>
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
            <br />
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
              <Button variant='ghost' leftIcon={<ShareIcon />} mb={1} w="fit-content" onClick={() => {
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
    </PageShell>
  )

}

export default UserSection;
