import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
Skeleton
import { useClipboard, Skeleton, Avatar, useColorMode, IconButton, Image, Button, Text, Heading, Flex, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import useSWR from "swr";

import NavBar from '@/components/NavbarSimple';
import Meta from '@/components/Meta';
import { EtherscanIcon, FullscreenIcon, MetadataIcon, OpenseaIcon, TablelandSmallIcon } from '@/public/icons';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { constructTokenURIQuery, getMetadata, getRigOwner } from '@/utils/rigs';
import AddressOrEns from '@/components/AddressOrEns';
import { CopyIcon } from '@chakra-ui/icons';

const UserSection = () => {

    const router = useRouter();
    const {colorMode} = useColorMode();
    const imageRef = useRef();
    const [owner, setOwner ] = useState(null);

    const { rigId } = router.query;
    const { onCopy } = useClipboard(`https://tablescan.io/rig/${rigId}`);

    const { data, error, isValidating, mutate } = useSWR(rigId ? [rigId]: null, getMetadata);

    useEffect(()=>{
        if (rigId && Boolean(owner)===false) getRigOwner(rigId).then(e=>{
            setOwner(e)
        })
    },[owner, rigId])

    if (error) return (
        <div>failed to load, {error}</div>
    );

    async function refresh(){
        let data = await getMetadata(rigId);
        mutate(data);
    }

    return (
        <>
            <Meta />
            <NavBar isLoading={isValidating} refresh={refresh} />
            <Flex flexDirection={{base: "column", md: "row"}} height="calc(100vh - 50px)" mt="50px" width="100%">
                {
                    data ? data.length != 0 ? (
                           <>
                                <Flex position='relative' ref={imageRef} h="100%" w={{base: '100%', md: '50%'}} alignItems="center" justifyContent='center' background='#80808014'>
                                    <IconButton position='absolute' bottom='20px' right='20px'  icon={<FullscreenIcon />} borderRadius="100%" onClick={()=>{
                                        imageRef.current.requestFullscreen();
                                    }}/>

                                    <Image
                                        src={'https://ipfs.io/ipfs/' + data?.thumb.replace('ipfs://','')}
                                        width="600px"
                                        height="auto"
                                    />

                                </Flex>
                                <Flex h="100%" direction='column' w={{base: '100%', md: '50%'}} justifyContent="center" alignItems='center'>
                                    <Flex direction='column' p={8} w={{base: '100%', md: '90%'}}>
                                        <Heading mb={{base: 4, md: 4}} size="3xl" mt={{base: 16, md: 0}}>
                                            {data?.name}
                                        </Heading>
                                        <Skeleton isLoaded={Boolean(owner) }>
                                            <Flex direction='row' align="center" my={4}>
                                                <Avatar size="sm" src={`https://gradient-avatar.glitch.me/${owner}`} title={owner} />
                                                <Flex direction='column' mb='2'>
                                                    <Text ml={4} mb='-1' fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                                        Owner
                                                    </Text>
                                                    <AddressOrEns
                                                        address={owner}
                                                        tooltip={false}
                                                        cursor="pointer"
                                                        onClick={()=>{
                                                            router.push(`/address/${owner}`)
                                                        }}
                                                    />
                                                </Flex>
                                            </Flex>
                                        </Skeleton>
                                        <Wrap>
                                        {
                                            data?.attributes.map(e=>(
                                                <WrapItem key={e?.trait_type}>
                                                    <Flex
                                                        direction="column"
                                                        backgroundColor='hsl(201deg 94% 60% / 11%)'
                                                        borderColor="blue.500"
                                                        borderWidth="1px"
                                                        borderRadius="10px"
                                                        p={2}
                                                    >
                                                        <Text fontSize='xs' letterSpacing='1px'  mb={1} textTransform='uppercase' color="blue.500">
                                                            {e?.trait_type}
                                                        </Text>
                                                        <Text fontSize='lg' fontWeight={600}>{e?.value}</Text>
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
                                            <Button variant='ghost' leftIcon={<CopyIcon />} mb={1} w="fit-content" onClick={onCopy}>Share Link</Button>
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
                        <Flex w="90vw" h="100vh" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )

                }
            </Flex>
        </>
    )

}

export default UserSection;


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
