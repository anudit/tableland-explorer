import React from "react";
import { useColorMode, Code, Flex, Text, useClipboard } from "@chakra-ui/react";
import { nameToExplorer, prettyTime, stringSize } from "@/utils/stringUtils";
import AddressOrEns from "./AddressOrEns";
import Link from "next/link";
import { ExternalIcon } from "@/public/icons";

const HistoryCard = ({tableName, hist, ...props}) => {
    const { hasCopied, onCopy } = useClipboard(hist?.statement);
    const { colorMode } = useColorMode();

    return (
        <Flex
            direction='column'
            borderWidth={1}
            borderRadius={4}
            borderColor={colorMode === 'light' ? '#0000001a' : '#ffffff1a'}
            p={2}
            _hover={{
                borderColor: 'gray.500'
            }}
            mb={2}
            {...props}
        >
            <Flex direction='row' justifyContent='space-between' mb={2}>
                <Flex direction='row' justifyContent="center" alignItems="center">
                    <Text fontWeight='bold' fontSize={{base: '2xs', md:'sm'}}>
                        {hist.statement.split(' ')[0].toUpperCase()} by
                    </Text>
                    <AddressOrEns address={hist.actionBy.id} ml={1} fontSize={{base: 'xs', md:'sm'}}/>
                    <Text fontWeight='light' fontSize={{base: '2xs', md:'sm'}} >
                    &nbsp;({stringSize(hist.statement)})
                    </Text>
                </Flex>
                <Flex direction='row' alignItems="center">
                    <Text fontSize={{base: '2xs', md:'sm'}}>{prettyTime(parseInt(hist.time)*1000)}</Text>
                    <Link href={`${nameToExplorer(tableName)}/tx/${hist.id}`} target="_blank">
                        <ExternalIcon ml={2} cursor="pointer" name="Open in New-Tab" mb='5px'/>
                    </Link>
                </Flex>
            </Flex>
            <Code p={1} onClick={onCopy}>
                <Text fontSize='xs' lineHeight='20px' noOfLines={4}>{hasCopied? "Copied" : hist.statement}</Text>
            </Code>
        </Flex>
    )
}
export default HistoryCard;
