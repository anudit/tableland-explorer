import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { chakra, Box, Tooltip, useColorMode, IconButton, Image, Button, Text, Heading, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import NavBar from '@/components/NavbarSimple';
import Meta from '@/components/Meta';
import { EtherscanIcon, FullscreenIcon, MetadataIcon, OpenseaIcon, ShareIcon, TablelandSmallIcon, TsIcon } from '@/public/icons';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { constructTokenURIQuery, getOpenData, getRigOwner, getTsRanking } from '@/utils/rigs';
import AddressOrEns from '@/components/AddressOrEns';
import EnsAvatar from '@/components/EnsAvatar';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function getHighestOrder(orders){
    if (orders) {
        let o =  orders
            ?.filter(e=>new Date(e?.expiration_time*1000)>new Date())
            ?.sort((a,b)=>parseInt(b['current_price']) - parseInt(a['current_price']))[0];
        return o;
    }
    else return false;
}

function getTokenDeets(openData, order){
    for (let i = 0; i < openData?.collection?.payment_tokens?.length; i++) {
        const tok = openData?.collection?.payment_tokens[i];
        if(tok?.address === order?.protocol_data?.parameters?.offer[0]?.token.toLowerCase()){
            return tok;
        }
    }
    return openData?.collection?.payment_tokens[0];
}

const UserSection = () => {

    const router = useRouter();
    const {colorMode} = useColorMode();
    const imageRef = useRef();
    const [owner, setOwner] = useState(false);

    const { rigId } = router.query;

    const { data, error, isValidating, mutate } = useSWR(rigId ? [rigId]: null, getOpenData);

    useEffect(()=>{
        if (rigId) getRigOwner(rigId).then(setOwner)
    }, [rigId])

    if (error) return (
        <div>failed to load, {error}</div>
    );

    async function refresh(){
        let data = await getOpenData(rigId);
        mutate(data);
    }

    return (
        <>
            <Meta url={ rigId ? `https://bafybeib3bbctx2gpuzicibprsa3h3zbusogxplccnlgbtmargfnh7bcria.ipfs.dweb.link/${rigId}/thumb.png` : false}/>
            <NavBar isLoading={isValidating} refresh={refresh} />
            <Flex flexDirection={{base: "column", md: "row"}} height="calc(100vh - 50px)" mt="50px">
                {
                    data ? data?.detail ? (
                        <Flex direction='column' alignItems='center' h="100%" w="100%" justifyContent='center'>
                                <Text fontSize='xl' align='center'>
                                    {data?.detail}
                                </Text>
                            </Flex>
                    ) :  data?.success !== false ? (
                           <>
                                <Flex position='relative' ref={imageRef} h="100%" w={{base: '100%', md: '50%'}} alignItems="center" justifyContent='center' background='#80808014'>
                                    <Flex direction="row" position='absolute' bottom='20px' right='20px' >
                                        <IconButton mr={1} icon={<ArrowBackIcon />} borderRadius="100%" onClick={()=>{
                                            router.push(`/rig/${parseInt(rigId)-1}`)
                                        }}/>
                                        <IconButton mr={1} icon={<ArrowForwardIcon />} borderRadius="100%" onClick={()=>{
                                            router.push(`/rig/${parseInt(rigId)+1}`)
                                        }}/>
                                        <IconButton icon={<FullscreenIcon />} borderRadius="100%" onClick={()=>{
                                            imageRef.current.requestFullscreen();
                                        }}/>
                                    </Flex>

                                    {
                                        data?.animation_url ? (
                                            <Box 
                                                width={{base: "300px", sm: "400px", lg:"500px"}}
                                                height={{base: "300px", sm: "400px", lg:"500px"}}
                                                shadow='dark-lg'    
                                            >
                                                <chakra.iframe 
                                                    src={data?.animation_url} 
                                                    width="100%"
                                                    height="100%"
                                                    
                                                />
                                            </Box>
                                        ) : (
                                            <Image
                                                src={data?.image_url}
                                                width="600px"
                                                height="auto"
                                                shadow='dark-lg'
                                            />
                                        )
                                    }

                                </Flex>
                                <Flex h="100%" direction='column' w={{base: '100%', md: '50%'}} justifyContent="center" alignItems='center'>
                                    <Flex direction='column' p={8} w={{base: '100%', md: '90%'}}>
                                        <Heading mb={{base: 4, md: 4}} size="3xl" mt={{base: 4, md: 0}} display="flex" alignItems='center'>
                                            {data?.name} <TsRank rigId={rigId} ml={6} />
                                        </Heading>
                                        <Flex direction={{base:'column', lg: 'row'}} align="left" my={4}>
                                            <Flex direction='row' mr={4} alignItems="center" mb={{base:4, lg:0}}>
                                                {
                                                    owner && (
                                                        <>
                                                            <EnsAvatar size="sm" address={owner} />
                                                            <Flex direction='column'>
                                                                <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                                    Owner
                                                                </Text>
                                                                <AddressOrEns
                                                                    address={owner}
                                                                    tooltip={false}
                                                                    cursor="pointer"
                                                                    onClick={()=>{
                                                                        router.push(`/address/${owner}`)
                                                                    }}
                                                                    ml={2}
                                                                />
                                                            </Flex>
                                                        </>
                                                    )
                                                }
                                            </Flex>
                                            <Flex direction='row' mr={4}>
                                                {
                                                    data?.last_sale && (
                                                        <Flex direction='row' alignItems="center">
                                                            <Image src={data?.last_sale?.payment_token?.image_url} height={8} width={8} />
                                                            <Flex direction='column'>
                                                                <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                                    Last Sale
                                                                </Text>
                                                                <Text ml={2} fontWeight={400} size={{base: 'sm', md: 'md'}}>
                                                                    {parseInt(data?.last_sale?.total_price) / (10**data?.last_sale?.payment_token?.decimals)}
                                                                    {" " + data?.last_sale?.payment_token?.symbol}
                                                                    {" "}
                                                                    (${(parseInt(data?.last_sale?.total_price) / (10**data?.last_sale?.payment_token?.decimals) * parseFloat(data?.last_sale?.payment_token?.usd_price)).toFixed(2)})
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    )
                                                }
                                                {
                                                    data?.seaport_sell_orders?.length>0 && (
                                                        <Flex direction='row' alignItems="center" ml={2}>
                                                            <Image src={getTokenDeets(data, getHighestOrder(data?.seaport_sell_orders))?.image_url} height={8} width={8} />
                                                            <Flex direction='column'>
                                                                <Text ml={2} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                                    Highest Offer
                                                                </Text>
                                                                <Text ml={2} fontWeight={400} size={{base: 'sm', md: 'md'}}>
                                                                    {parseInt(getHighestOrder(data?.seaport_sell_orders)?.current_price) / (10**getTokenDeets(data, getHighestOrder(data?.seaport_sell_orders))?.decimals)}
                                                                    {" " + getTokenDeets(data, getHighestOrder(data?.seaport_sell_orders))?.symbol}
                                                                    {" "}
                                                                    (${(parseInt(getHighestOrder(data?.seaport_sell_orders)?.current_price) / (10**getTokenDeets(data, getHighestOrder(data?.seaport_sell_orders))?.decimals) * parseFloat(getTokenDeets(data, getHighestOrder(data?.seaport_sell_orders))?.usd_price)).toFixed(2)})
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    )
                                                }
                                            </Flex>
                                        </Flex>
                                        <Wrap mt={2}>
                                        {
                                            data?.traits.sort((a, b)=>String(a.trait_type).toLowerCase().charCodeAt(0) - String(b.trait_type).toLowerCase().charCodeAt(0)).map(e=>(
                                                <WrapItem key={e?.trait_type}>
                                                    <Flex
                                                        direction="column"
                                                        backgroundColor='hsl(201deg 94% 60% / 11%)'
                                                        borderColor="blue.500"
                                                        borderWidth="1px"
                                                        borderRadius="10px"
                                                        p={2}
                                                    >
                                                        <Text fontSize='x-small' letterSpacing='1px'  mb={1} textTransform='uppercase' color="blue.500">
                                                            {e?.trait_type}
                                                        </Text>
                                                        <Text fontSize='md' fontWeight={600}>{e?.value}</Text>
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
                           </>
                        ) : (
                            <Flex direction='column' alignItems='center' h="100%" w="100%" justifyContent='center'>
                                <Text fontSize='xl' align='center'>
                                    Rig not Found.
                                </Text>
                                <br/>
                                <Button leftIcon={<TablelandSmallIcon/>} rightIcon={<ExternalLinkIcon />} onClick={()=>{
                                    window.open('https://docs.tableland.xyz/build-a-dynamic-nft-in-solidity', '_blank');
                                }}>
                                    Get one
                                </Button>
                            </Flex>
                        )
                    : (
                        <Flex w="100%" h="calc(100vh - 50px)" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )

                }
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
