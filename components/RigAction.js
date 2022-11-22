import React from "react";
import { Stack, Skeleton, useColorMode, Avatar, Flex, Text, IconButton } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { prettyTime } from "@/utils/stringUtils";
import AddressOrEns from "./AddressOrEns";
import { useRouter } from "next/router";
import Link from "next/link";
import EnsAvatar from "./EnsAvatar";
import { OpenseaIcon2 } from "@/public/icons";
import { ArrowForwardIcon } from "@chakra-ui/icons";


const RigAction = ({data, ...props}) => {
    const { colorMode } = useColorMode();
    const router = useRouter();

    if (data?.type == 'sale'){
        return (
            <RigActionShell {...props}>
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
                            <Avatar
                                size="xs"
                                icon={<OpenseaIcon2 boxSize={6}/>}
                                title={'Opensea'}
                                cursor="pointer"
                                onClick={()=>{
                                    window.open(`https://opensea.io/assets/ethereum/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${data?.nft?.token_id}`, '_blank');
                                }}
                            />
                        )}
                    </Flex>
                    <Flex fontSize={{base:'xs', sm: 'sm'}} >
                        <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                            {prettyTime(new Date(data?.transaction_date).getTime())}
                        </Text>
                    </Flex>
                </Flex>
                <Flex direction="row" alignItems='center' justifyContent='space-between'>
                    <Flex w="100%" alignItems='center'>
                        <EnsAvatar address={data?.seller_address} />
                        <Flex direction="column" mx={2}>
                            <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                Seller
                            </Text>
                            <AddressOrEns ml={0} mt="-4px" size={{base: 'xs', md: 'sm'}} address={data?.seller_address} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.seller_address}`)
                            }}/>
                        </Flex>
                        <ArrowForwardIcon />
                        <EnsAvatar ml={2} address={data?.buyer_address} />
                        <Flex direction="column" mx={2}>
                            <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                Buyer
                            </Text>
                            <AddressOrEns ml={0} mt="-4px" size={{base: 'xs', md: 'sm'}} address={data?.buyer_address} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.buyer_address}`)
                            }}/>
                        </Flex>

                    </Flex>
                    <IconButton variant='ghost' icon={<ExternalLinkIcon/>} onClick={()=>{
                        window.open(`https://etherscan.io/tx/${data?.transaction_hash}`, '_target')
                    }}/>
                </Flex>
            </RigActionShell>
        )
    }
    else if (data?.type == 'cancel_list'){
        return (
            <RigActionShell {...props}>
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
                                icon={<OpenseaIcon2 boxSize={6}/>}
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
            </RigActionShell>
        )
    }
    else if (data?.type == 'mint'){
        return (
            <RigActionShell {...props}>
                <Flex direction="row" textAlign='left' alignItems='center' mb={2} justifyContent="space-between">
                    <Flex fontSize={{base:'sm', sm: 'lg', md:'2xl'}}>
                        <Text mr={2}>
                            Minted
                        </Text>
                        <Link href={`/rig/${data?.token_id}`} >
                            <Text mr={2} fontWeight='bold' cursor="pointer">Rig #{data?.token_id}</Text>
                        </Link>
                    </Flex>
                    <Flex fontSize={{base:'xs', sm: 'sm'}}>
                        {prettyTime(new Date(data?.transaction_date).getTime())}
                    </Flex>
                </Flex>
                <Flex direction="row" alignItems='center' justifyContent='space-between'>
                    <Flex w="100%" alignItems='center'>
                        <EnsAvatar address={data?.owner_address} />
                        <AddressOrEns ml={2} mr={2} address={data?.owner_address} tooltip={false} onClick={()=>{
                            router.push(`/address/${data?.owner_address}`)
                        }}/>
                    </Flex>
                    <IconButton variant='ghost' icon={<ExternalLinkIcon/>} onClick={()=>{
                        window.open(`https://etherscan.io/tx/${data?.transaction_hash}`, '_blank')
                    }}/>
                </Flex>
            </RigActionShell>
        )
    }
    else if (data?.type == 'transfer'){
        return (
            <RigActionShell {...props}>
                <Flex direction="row" textAlign='left' alignItems='center' mb={2} justifyContent="space-between">
                    <Flex fontSize={{base:'sm', sm: 'lg', md:'2xl'}} alignItems='center'>
                        <Link href={`/rig/${data?.token_id}`} >
                            <Text mr={{base: 1, md: 2}} fontWeight={700} cursor="pointer">Rig #{data?.token_id}</Text>
                        </Link>
                        <Text mr={{base: 1, md: 2}}>
                            Transferred
                        </Text>
                    </Flex>
                    <Flex fontSize={{base:'xs', sm: 'sm'}}>
                        {prettyTime(new Date(data?.transaction_date).getTime())}
                    </Flex>
                </Flex>
                <Flex direction="row" alignItems='center' justifyContent='space-between'>
                    <Flex w="100%" alignItems='center'>
                        <EnsAvatar address={data?.transfer_from} />
                        <Flex direction="column" mx={2}>
                            <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                Sender
                            </Text>
                            <AddressOrEns ml={0} mt="-4px" size={{base: 'xs', md: 'sm'}} address={data?.transfer_from} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.transfer_from}`)
                            }}/>
                        </Flex>
                        <ArrowForwardIcon />
                        <EnsAvatar ml={2} address={data?.transfer_to} />
                        <Flex direction="column" mx={2}>
                            <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                Receiver
                            </Text>
                            <AddressOrEns ml={0} mt="-4px" size={{base: 'xs', md: 'sm'}} address={data?.transfer_to} tooltip={false} onClick={()=>{
                                router.push(`/address/${data?.transfer_to}`)
                            }}/>
                        </Flex>

                    </Flex>
                    <IconButton variant='ghost' icon={<ExternalLinkIcon/>} onClick={()=>{
                        window.open(`https://etherscan.io/tx/${data?.transaction_hash}`, '_target')
                    }}/>
                </Flex>
            </RigActionShell>
        )
    }
    else {
        return (
            <RigActionShell {...props}>
                <Stack w="100%">
                    <Skeleton height='40px' />
                    <Skeleton height='20px' />
                </Stack>
            </RigActionShell>
        )
    }
}
export default RigAction;


const RigActionShell = ({children, ...props}) => {
    const { colorMode } = useColorMode();
    return (
        <Flex
            borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
            borderWidth='1px'
            borderRadius={10}
            w="100%"
            direction="column"
            justifyContent="space-between"
            p={4}
            {...props}
        >
            {children}
        </Flex>
    )
}
