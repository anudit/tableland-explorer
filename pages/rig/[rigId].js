import React, { useEffect, useRef, useState } from 'react';
import { chakra, Box, Tooltip, useColorMode, IconButton, Image, Button, Text, Heading, Flex, Wrap, WrapItem } from "@chakra-ui/react";

import NavBar from '@/components/NavbarSimple';
import Meta from '@/components/Meta';
import { EtherscanIcon, EthIcon, FullscreenIcon, MetadataIcon, OpenseaIcon, ShareIcon, TsIcon } from '@/public/icons';
import { constructTokenURIQuery, getReservoirData, getTsRanking } from '@/utils/rigs';
import AddressOrEns from '@/components/AddressOrEns';
import EnsAvatar from '@/components/EnsAvatar';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import Link from 'next/link';

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
      },
    }
}

const UserSection = ({pageData, rigId}) => {

    const {colorMode} = useColorMode();
    const imageRef = useRef();

    return (
        <>
            <Meta title={`Rig ${rigId} - Tablescan`} url={`https://bafybeib3bbctx2gpuzicibprsa3h3zbusogxplccnlgbtmargfnh7bcria.ipfs.dweb.link/${rigId}/thumb.png`}/>
            <NavBar />
            <Flex flexDirection={{base: "column", md: "row"}} height="calc(100vh - 50px)" mt="50px">
                <Flex position='relative' ref={imageRef} h="100%" w={{base: '100%', md: '50%'}} alignItems="center" justifyContent='center' background='#80808014'>
                    <Flex direction="row" position='absolute' bottom='20px' right='20px' >
                        <Link href={`/rig/${parseInt(rigId)-1}`}>
                            <IconButton mr={1} icon={<ArrowBackIcon />} borderRadius="100%"/>
                        </Link>
                        <Link href={`/rig/${parseInt(rigId)+1}`}>
                            <IconButton mr={1} icon={<ArrowForwardIcon />} borderRadius="100%"/>
                        </Link>
                        <IconButton icon={<FullscreenIcon />} borderRadius="100%" onClick={()=>{
                            imageRef.current.requestFullscreen();
                        }}/>
                    </Flex>
                    <Box 
                        width={{base: "300px", sm: "400px", lg:"500px"}}
                        height={{base: "300px", sm: "400px", lg:"500px"}}
                        shadow='dark-lg'    
                    >
                        <chakra.iframe 
                            src={`https://rigs.tableland.xyz/${rigId}.html`} 
                            width="100%"
                            height="100%" 
                        />
                    </Box>

                </Flex>
                <Flex h="100%" direction='column' w={{base: '100%', md: '50%'}} justifyContent="center" alignItems='center'>
                    <Flex direction='column' p={8} w={{base: '100%', md: '90%'}}>
                        <Heading mb={{base: 4, md: 4}} size="3xl" mt={{base: 4, md: 0}} display="flex" alignItems='center'>
                            Rig #{rigId} <TsRank rigId={rigId} ml={6} />
                        </Heading>
                        <Flex direction={{base:'column', lg: 'row'}} align="left" my={4}>
                            <Flex direction='row' mr={4} alignItems="center" mb={{base:4, lg:0}}>
                                <EnsAvatar size="sm" address={pageData.token.owner} />
                                <Flex direction='column'>
                                    <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                        Owner
                                    </Text>
                                    <Link href={`/address/${pageData.token.owner}`}>
                                        <AddressOrEns
                                            address={pageData.token.owner}
                                            tooltip={false}
                                            cursor="pointer"
                                            ml={2}
                                        />
                                    </Link>

                                </Flex>
                            </Flex>
                            <Flex direction='row' mr={4}>
                                {
                                    Boolean(pageData.token.lastBuy) && (
                                        <Flex direction='row' alignItems="center">
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
                                        <Flex direction='row' alignItems="center" ml={{base: 8, md: 4}}>
                                            <Image src={pageData.market.topBid.source.icon} height={8} width={8} title={pageData.market.topBid.source.name} />
                                            <Flex direction='column'>
                                                <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                    Highest Offer
                                                </Text>
                                                <Text ml={2} fontWeight={400} size={{base: 'sm', md: 'md'}}>
                                                    {pageData.market.topBid.price.amount.native}
                                                    {" " + pageData.market.topBid.price.currency.symbol}
                                                    {" "}
                                                    (${parseFloat(pageData.market.topBid.price.amount.usd).toFixed(2)})
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                            </Flex>
                        </Flex>
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
                                        <Text fontSize='x-small' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>{e?.tokenCount} ({(e?.tokenCount/3000).toFixed(2)}%)</Text>
                                    </Flex>
                                </WrapItem>
                                )
                            )
                        }
                        </Wrap>
                        <br/>
                        <Flex direction="row" alignItems='flex-start'>
                            <Button variant='ghost' leftIcon={<OpenseaIcon />} mb={1} w="fit-content"  onClick={()=>{
                                window.open(`https://opensea.io/assets/ethereum/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${rigId}`, '_target');
                            }}>View on Opensea</Button>
                            <Button variant='ghost' leftIcon={<EtherscanIcon />} mb={1} w="fit-content" onClick={()=>{
                                window.open(`https://etherscan.io/nft/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${rigId}`, '_target');
                            }}>View on Etherscan</Button>
                        </Flex>
                        <Flex direction="row" alignItems='flex-start'>
                            <Button variant='ghost' leftIcon={<MetadataIcon />} mb={1} w="fit-content" onClick={()=>{
                                window.open(constructTokenURIQuery(rigId), '_target');
                            }}>View Metadata</Button>
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
                        {/* <ProvSection rigId={rigId}/> */}
                    </Flex>
                </Flex>
            </Flex>
        </>
    )

}

export default UserSection;


const TsRank = ({rigId, ...props}) => {
    const [tsData, setTsData] = useState(false);

    useEffect(()=>{
        if (rigId) getTsRanking([rigId]).then(setTsData).catch((e)=>{
            console.log(e);
        })
    },[rigId])

    if(tsData && Boolean(tsData?.ranks) === true){
        return (
            <Tooltip label="Trait Sniper Ranking" placement='top' hasArrow>
                <Button leftIcon={<TsIcon/>} colorScheme='purple' size="xs" variant='solid' onClick={()=>{
                    window.open(`https://app.traitsniper.com/tableland-rigs?view=${rigId}`, '_blank')
                }} {...props}>
                    #{tsData?.ranks[0]?.rarity_rank}
                </Button>
            </Tooltip>
        )
    }
    else {
        return (<></>)
    }
}

// const ProvSection = ({rigId}) => {
//     const [prov, setProv] = useState(false);

//     useEffect(()=>{
//         getRigTxns(rigId).then(setProv)
//     },[rigId])

//     return (
//         <Flex direction="column" mt="20px">
//             {
//                 prov && prov?.map(e=>{
//                     return (
//                         <Flex direction='column' key={e.transaction_hash}>
//                             <Text textTransform='uppercase' fontSize="sm">
//                                 {e.type}
//                             </Text>
//                         </Flex>
//                     )
//                 })
//             }
//         </Flex>
//     )
// }
