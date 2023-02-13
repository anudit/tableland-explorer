import React, { useState, useContext, useEffect } from 'react';
import { ButtonGroup, Input, Textarea, useDisclosure, Tooltip, useColorMode, AvatarGroup, IconButton, Avatar, Text, Flex, Spinner, Button } from "@chakra-ui/react";
import timeAgo, { nameToAvatar, nameToChainName, parseTableData, toProperCase } from '@/utils/stringUtils';
import Link from 'next/link';
import AddressOrEns from './AddressOrEns';
import { ChatIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import EnsAvatar from './EnsAvatar';
import { LikedIcon, LikeIcon, ShuffleIcon } from '@/public/icons';
import { useAccount } from 'wagmi';
import { WalletContext } from '@/contexts/Wallet';

import { AlertDialog, AlertDialogBody, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react'
import { Database } from '@tableland/sdk';
import { getLikes } from '@/utils/ops';
import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';
import { useSigner } from 'wagmi';

const loaderProp = ({ src }) => { return src }

const LIKES_ADDRESS = "0x7fdf9fce06bdc3ee7702b2051ba21322d8c93326";
const LIKES_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"fullTableNameHash","type":"string"},{"indexed":false,"internalType":"string","name":"fullTableName","type":"string"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Like","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"fullTableNameHash","type":"string"},{"indexed":false,"internalType":"string","name":"fullTableName","type":"string"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Unlike","type":"event"},{"inputs":[{"internalType":"string","name":"fullTableName","type":"string"}],"name":"like","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"fullTableName","type":"string"}],"name":"unlike","outputs":[],"stateMutability":"nonpayable","type":"function"}]


const TableCard = ({tableName, infoClick, table, ...props}) => {

    const [remixName, setRemixName] = useState(false);
    const { colorMode } = useColorMode()
    const { address } = useAccount();
    const { cleanStatement } = useContext(WalletContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { chain } = useNetwork();
    const { data: signer } = useSigner();
    
    const [likes, setLikes] = useState(false);

    useEffect(()=>{
        console.log(address, likes)
    }, [address, likes])

    async function createTableProcess(tableId="", tableName="", statement = ""){

        try {
            let {justName, statementCleaned} = cleanStatement(tableId, tableName, statement);

            const db = new Database();

            onOpen();

            const { meta: create } = await db
                .prepare(statementCleaned)
                .run();

            await create.wait;

            setRemixName(justName);


        } catch (error) {
            console.log('error', error);
            setRemixName(false);
            onClose();
        }

    }

    async function likeTable() {
        if (chain.id === 80001){

            try {
                const likesInstance = new ethers.Contract(LIKES_ADDRESS, LIKES_ABI, signer);
                await likesInstance.like(tableName);
                getLikes(tableName).then(setLikes)
                

            } catch (error) {
                alert(error?.message);
                console.log('error', error);
            }

        }
        else {
            alert(`Switch to Polygon Mumbai Testnet, You're on ${chain.name}`);
        }
    }

    async function unlikeTable() {
        if (chain.id === 80001){

            try {
                const likesInstance = new ethers.Contract(LIKES_ADDRESS, LIKES_ABI, signer);
                await likesInstance.unlike(tableName);
                getLikes(tableName).then(setLikes)
                

            } catch (error) {
                alert(error?.message);
                console.log('error', error);
            }

        }
        else {
            alert(`Switch to Polygon Mumbai Testnet, You're on ${chain.name}`);
        }
    }

    useEffect(()=>{
        getLikes(tableName).then(setLikes)
    },[tableName])


    if (tableName){
        let {chainId, tableId} = parseTableData(tableName);
        return (
            <Flex
                direction='column'
                borderRadius={{base: 0, md: 20}}
                borderWidth={1}
                w={{base: '100%', md:'600px'}}
                h={{base: 'calc(100vh - 100px)', md:'auto'}}
                mb={{base: 0, md: 0}}
                borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
                {...props}
            >
                <AlertDialog
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                {
                                    remixName ? "Table Created 🥳": "Approve Table Creation"
                                }
                            </AlertDialogHeader>

                            {
                                remixName ? (
                                    <AlertDialogBody alignContent='center'>
                                        <Link href={`/${remixName}`} target="_blank">
                                            <Button>Explore Table</Button>
                                        </Link>
                                        <br/>
                                        <br/>
                                    </AlertDialogBody>
                                ) : table?.name ? (

                                    <AlertDialogBody>
                                        <Text>Table Name</Text>
                                        <Input
                                            value={cleanStatement(table.id, table.name, table.statement).justName}
                                            size='sm'
                                            readOnly
                                        />
                                        <Text mt={4}>Creation Statement</Text>
                                        <Textarea
                                            value={cleanStatement(table.id, table.name, table.statement).statementCleaned}
                                            size='sm'
                                            readOnly
                                        />
                                        <br/><br/>
                                    </AlertDialogBody>
                                ) : (
                                    <AlertDialogBody>
                                        Loading...
                                    </AlertDialogBody>
                                )
                            }
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <Flex direction='row' p={3} justifyContent="space-between" alignItems='center'>
                    <Flex direction='row' align="center" ml={2}>
                        <AvatarGroup >
                            <EnsAvatar size="sm" address={table.owner.id}/>
                            <Avatar size="sm" src={nameToAvatar(tableName)} title={nameToChainName(tableName)} alt={nameToChainName(tableName)}/>
                        </AvatarGroup>
                        <Flex direction='column'>
                            <AddressOrEns
                                address={table.owner.id}
                                tooltip={false}
                                cursor="pointer"
                                mb='-1'
                            />
                            <Text ml={4}  fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                Created {timeAgo(table.created)}
                            </Text>
                        </Flex>
                    </Flex>
                    <IconButton icon={<InfoOutlineIcon />} onClick={infoClick} variant='solid' borderRadius='100%'/>
                </Flex>
                <Flex alignItems='center' h="100%" onDoubleClick={likeTable}>
                    <Image
                        src={`https://render.tableland.xyz/${chainId}/${tableId}`}
                        height={600}
                        width={600}
                        style={{objectFit:'fill'}}
                        placeholder="blur"
                        loader={loaderProp}
                        onError={(e) => {
                            e.currentTarget.setAttribute('src', 'https://res.cloudinary.com/anudit/image/upload/v1663653643/convo/tableland-thumb.png');
                        }}
                        blurDataURL='data:image/webp;base64,UklGRvICAABXRUJQVlA4WAoAAAAgAAAAiAAAiAAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOCC0AAAA8AkAnQEqiQCJAD8RiLdZrCiko6BpGYAiCWlu3V4BccD8gG3UuJA5bDj5gswX6CJ2XClGpP1xG9Jeqxve088zeVaRMZ/+kLUqVV3Q4ktj8iBLSKw30Z+TVAD+5tLcGtA5lVp+Qi2IYnvQ9NCG3irmy3cWiK0Wbbtjnj3l6mHBlIfAdAVaUzXWgFXkRlhMNQbSysWv2s/BS4hb/2FGcyXflzMgEaqDk/otD1Jar+fMu4s8CgAA'
                        alt={`Picture of the ${tableName}`}
                    />
                    <Flex h="50px" bg={colorMode === 'light' ? 'gray.200': 'gray.800'} position="absolute" b="0">

                    </Flex>
                </Flex>
                <Flex direction='column' m={4} justifyContent='space-between'>
                    <Flex direction='row' alignItems='center'>
                        <Text fontSize={{base:'sm' , md:'lg'}} fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" w="100%">{toProperCase(tableName.split("_").slice(0,-2).join(' '))}</Text>
                        <Text size='sm'  ml={2} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>#{tableId}</Text>
                    </Flex>
                    
                    <Flex direction='row' alignItems='center' mt={{base: "10px", md: 0}} justifyContent={'space-between'}>
                        <div>
                            <ButtonGroup>
                                <Flex alignItems='center'>
                                    {
                                        address && likes !=false && likes.map(e=>e?.address.toLowerCase())?.includes(address.toLowerCase()) ? (
                                            <Tooltip hasArrow label='Remove Like' placement='top-start'>
                                                <LikedIcon mr={2}
                                                    onClick={unlikeTable} cursor="pointer"
                                                />
                                            </Tooltip>
                                        ) : (
                                            <LikeIcon mr={2}
                                                onClick={likeTable} cursor="pointer"
                                            />
                                        )
                                    }
                                    
                                    {
                                        likes === false ? (<Spinner size="sm"/>) : likes.length === 0 ? (
                                            <Text colorScheme='gray'>0</Text>
                                        ) : (
                                            <Flex direction='row' alignItems='center'>
                                                <Text mr={1}>Liked by</Text>
                                                <AvatarGroup size='xs' max={2}>
                                                    {
                                                        likes.slice(0, Math.min(3, likes.length)).map((e, oid)=>{
                                                            return (
                                                                <Link href={`/address/${e?.address}`} key={oid}>
                                                                    <EnsAvatar address={e?.address} size="xs" cursor="pointer" mr={0}/>
                                                                </Link>
                                                            )
                                                        })
                                                    }
                                                </AvatarGroup>
                                            </Flex>
                                        )
                                    }
                                </Flex>
                                <Button leftIcon={<ChatIcon/>} isDisabled variant='ghost'>
                                    0
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <Tooltip label={!address ? 'Connect Wallet' : `Remix Table Schema`} placement='top'>
                                <Button
                                    isDisabled={true}
                                    leftIcon={<ShuffleIcon />}
                                    size='sm'
                                    borderRadius="100px"
                                    color={colorMode === 'light' ? 'white' : 'black'}
                                    backgroundColor={colorMode === 'light' ? 'black' : 'white'}
                                    _hover={{
                                        backgroundColor: colorMode === 'light' ? 'black' : 'white'
                                    }}
                                    mr={2}
                                    onClick={()=>{
                                        createTableProcess(table.id, tableName, table.statement);
                                    }}
                                >
                                    Remix
                                </Button>
                            </Tooltip>
                            <Link href={`/${tableName}`}>
                                <Button
                                    size='sm'
                                    borderRadius="100px"
                                    color={colorMode === 'light' ? 'white' : 'black'}
                                    backgroundColor={colorMode === 'light' ? 'black' : 'white'}
                                    _hover={{
                                        backgroundColor: colorMode === 'light' ? 'black' : 'white'
                                    }}
                                >
                                        Explore Table
                                </Button>
                            </Link>
                        </div>
                        
                    </Flex>
                </Flex>
            </Flex>
        )
    }
    else {
        return (<Flex direction='column'>
            <Spinner />
        </Flex>)
    }
}

export default TableCard;
