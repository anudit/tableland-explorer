import React from 'react';
import { Avatar, Tooltip, Tag, Text, Flex, Spinner, Image, Button, useClipboard } from "@chakra-ui/react";
import { nameToAvatar, parseTableData, toProperCase } from '@/utils/stringUtils';
import Link from 'next/link';

const TableCard = ({tableName}) => {

    const { hasCopied, onCopy } = useClipboard(tableName);

    if (tableName){
        let {chainId, tableId} = parseTableData(tableName);
        return (
            <Flex direction='column' borderRadius={10} borderWidth={1}>
                <Flex direction='row' p={3} justifyContent="space-between">
                    <Flex direction='row' align="center">
                        <Avatar size="xs" src={nameToAvatar(tableName)} />
                        <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Full Name"} placement='bottom'>
                            <Text ml="2" fontWeight={'medium'} onClick={onCopy} cursor="pointer" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                {toProperCase(tableName.split("_").slice(0,-2).join(' '))}
                            </Text>
                        </Tooltip>
                    </Flex>
                    <Tag size='sm'>#{tableId}</Tag>
                </Flex>
                <Image
                    src={`https://render.tableland.xyz/${chainId}/${tableId}`}
                    height="300px"
                    width="auto"
                    objectFit='cover'
                    fallbackSrc='https://res.cloudinary.com/anudit/image/upload/v1663653643/convo/tableland-thumb.png'
                    alt={`Picture of the ${tableName}`}
                />
                <Flex direction='row'>
                    <Link href={`/${tableName}`}>
                        <Button w="100%" m={2} colorScheme='blue'>Explore Table</Button>
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
