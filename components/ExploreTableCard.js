import React from 'react';
import { useColorMode, AvatarGroup, IconButton, Avatar, Text, Flex, Spinner, Image, Button } from "@chakra-ui/react";
import { nameToAvatar, nameToChainName, parseTableData, toProperCase } from '@/utils/stringUtils';
import Link from 'next/link';
import AddressOrEns from './AddressOrEns';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const TableCard = ({tableName, infoClick, table}) => {

    const { colorMode } = useColorMode()

    if (tableName){
        let {chainId, tableId} = parseTableData(tableName);
        return (
            <Flex direction='column' borderRadius={20} borderWidth={1} w={{base: '100%', md:'600px'}} mb={4} borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}>
                <Flex direction='row' p={3} justifyContent="space-between" alignItems='center'>
                    <Flex direction='row' align="center" ml={2}>
                        <AvatarGroup >
                            <Avatar size="sm" src={`https://gradient-avatar.glitch.me/${table.owner.id}`} title={table.owner.id} />
                            <Avatar size="sm" src={nameToAvatar(tableName)} title={nameToChainName(tableName)} />
                        </AvatarGroup>
                        <Flex direction='column'>
                            <Text ml={4} fontSize='sm' color={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.700'}>Creator</Text>
                            <Link href={`/address/${table.owner.id}`}>
                                <AddressOrEns address={table.owner.id} tooltip={false}/>
                            </Link>
                        </Flex>
                    </Flex>
                    <IconButton icon={<InfoOutlineIcon />} onClick={infoClick} variant='ghost' borderRadius='100%'/>
                </Flex>
                <Image
                    src={`https://render.tableland.xyz/${chainId}/${tableId}`}
                    height="600px"
                    width="auto"
                    objectFit='cover'
                    fallbackSrc='https://res.cloudinary.com/anudit/image/upload/v1663653643/convo/tableland-thumb.png'
                    alt={`Picture of the ${tableName}`}
                />
                <Flex direction='row' m={4} alignItems='center' justifyContent='space-between'>
                    <Flex direction='row' alignItems='center'>
                        <Text fontSize='lg' fontWeight={600}>{toProperCase(tableName.split("_").slice(0,-2).join(' '))}</Text>
                        <Text size='sm'  ml={2}>#{tableId}</Text>
                    </Flex>
                    <Link href={`/${tableName}`}>
                        <Button size='sm' borderRadius="100px" colorScheme='blue'>Explore</Button>
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
