import React from "react";
import { Stack, Skeleton, useColorMode, Avatar, Flex, Text, IconButton } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { prettyTime } from "@/utils/stringUtils";
import AddressOrEns from "./AddressOrEns";
import { useRouter } from "next/router";
import Link from "next/link";
import EnsAvatar from "./EnsAvatar";


const RigAction = ({data}) => {
    const { colorMode } = useColorMode();
    const router = useRouter();

    if (data?.type == 'sale'){
        return (
            <Flex
                borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
                borderWidth='1px'
                borderRadius={10}
                w="100%"
                direction="column"
                p={4}
            >
                <Flex direction="column" justifyContent='space-between'>
                    <Flex direction="row" textAlign='left' alignItems='center' mb={2} justifyContent="space-between">
                        <Flex fontSize={{base:'sm', sm: 'lg', md:'2xl'}} alignItems='center'>
                            <Link href={`/rig/${data?.nft?.token_id}`} >
                                <Text mr={{base: 1, md: 2}} fontWeight={700} cursor="pointer">Rig #{data?.nft?.token_id}</Text>
                            </Link>
                            <Text mr={{base: 1, md: 2}}>
                                sold for
                            </Text>
                            <Text fontWeight='medium' mr={{base: 1, md: 2}}>
                                {data?.price_details?.price} ETH
                            </Text>
                            <Text mr={{base: 1, md: 2}} >on</Text>
                            {data?.marketplace === 'opensea' && (
                                <Avatar size="xs" src={'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg'} title={'Opensea'} />
                            )}
                        </Flex>
                        <Flex fontSize={{base:'xs', sm: 'sm'}}>
                            {prettyTime(new Date(data?.transaction_date).getTime())}
                        </Flex>
                    </Flex>
                    <Flex direction="row" alignItems='center' justifyContent='space-between'>
                        <Flex w="100%" alignItems='center'>
                            <EnsAvatar address={data?.seller_address} />
                            <AddressOrEns size={{base: 'xs', md: 'sm'}} ml={2} mr={2} address={data?.seller_address} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.seller_address}`)
                            }}/>
                            <Text>to</Text>
                            <EnsAvatar ml={2} address={data?.buyer_address} />
                            <AddressOrEns size={{base: 'xs', md: 'sm'}} ml={2} mr={2} address={data?.buyer_address} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.buyer_address}`)
                            }}/>

                        </Flex>
                        <IconButton variant='ghost' icon={<ExternalLinkIcon/>} onClick={()=>{
                            window.open(`https://etherscan.io/tx/${data?.transaction_hash}`, '_target')
                        }}/>
                    </Flex>
                </Flex>
            </Flex>
        )
    }
    else if (data?.type == 'cancel_list'){
        return (
            <Flex
                borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
                borderWidth='1px'
                borderRadius={20}
                w="100%"
                direction="column"
                p={4}
            >
                <Flex direction="column" justifyContent='space-between'>
                    <Flex direction="row" textAlign='left' alignItems='center' mb={2} justifyContent="space-between">
                        <Flex fontSize={{base:'sm', sm: 'lg', md:'2xl'}}>
                            <Text mr={2}>
                                Listing Cancelled for
                            </Text>
                            <Link href={`/rig/${data?.nft?.token_id}`} >
                                <Text mr={2} fontWeight='bold' cursor="pointer">Rig #{data?.nft?.token_id}</Text>
                            </Link>
                        </Flex>
                        <Flex fontSize={{base:'xs', sm: 'sm'}}>
                            {prettyTime(new Date(data?.transaction_date).getTime())}
                        </Flex>
                    </Flex>
                    <Flex direction="row" alignItems='center' justifyContent='space-between'>
                        <Flex w="100%" alignItems='center'>
                            <EnsAvatar address={data?.lister_address} />
                            <AddressOrEns ml={2} mr={2} address={data?.lister_address} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.lister_address}`)
                            }}/>
                            <Text>on</Text>
                            {data?.marketplace === 'opensea' && (
                                <Avatar
                                    ml={2}
                                    size="sm"
                                    src={'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg'} title={'Opensea'}
                                    cursor="pointer"
                                    onClick={()=>{
                                        window.open(`https://opensea.io/assets/ethereum/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${data?.nft?.token_id}`,'_blank')
                                    }}
                                />
                            )}
                        </Flex>
                        <IconButton variant='ghost' icon={<ExternalLinkIcon/>} onClick={()=>{
                            window.open(`https://etherscan.io/tx/${data?.transaction_hash}`, '_blank')
                        }}/>
                    </Flex>
                </Flex>
            </Flex>
        )
    }
    else {
        return (
            <Flex
                borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
                borderWidth='1px'
                borderRadius={20}
                w="100%"
                direction="column"
                p={4}
                mb={4}
            >
                <Stack>
                    <Skeleton height='40px' />
                    <Skeleton height='20px' />
                </Stack>
            </Flex>
        )
    }
}
export default RigAction;
