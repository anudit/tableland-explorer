import React from 'react';
import { useColorMode, AvatarGroup, IconButton, Avatar, Text, Flex, Spinner, Button } from "@chakra-ui/react";
import timeAgo, { nameToAvatar, nameToChainName, parseTableData, toProperCase } from '@/utils/stringUtils';
import Link from 'next/link';
import AddressOrEns from './AddressOrEns';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import EnsAvatar from './EnsAvatar';

const loaderProp = ({ src }) => { return src }

const TableCard = ({tableName, infoClick, table, ...props}) => {

    const { colorMode } = useColorMode()

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
                <Flex alignItems='center' h="100%">
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
                <Flex direction='row' m={4} alignItems='center' justifyContent='space-between'>
                    <Flex direction='row' alignItems='center'>
                        <Text fontSize='lg' fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{toProperCase(tableName.split("_").slice(0,-2).join(' '))}</Text>
                        <Text size='sm'  ml={2} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>#{tableId}</Text>
                    </Flex>
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
