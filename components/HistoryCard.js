import React from "react";
import { Code, Flex, Text, useClipboard } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { nameToExplorer, prettyTime, stringSize } from "@/utils/stringUtils";
import AddressOrEns from "./AddressOrEns";

const HistoryCard = ({tableName, hist, ...props}) => {
    const { hasCopied, onCopy } = useClipboard(hist?.statement);
    
    return (
        <Flex
            direction='column'
            borderWidth={1}
            borderRadius={4}
            borderColor='gray.100'
            p={2}
            _hover={{
                borderColor: 'gray.500'
            }}
            mb={2}
            {...props}
        >
            <Flex direction='row' justifyContent='space-between' mb={2}>
            <Flex direction='row' justifyContent="center">
                <Text fontWeight='bold' fontSize='small'>
                    {hist.statement.split(' ')[0].toUpperCase()} by
                </Text>
                <AddressOrEns address={hist.actionBy.id} ml={1} fontSize="sm"/>                
                <Text fontWeight='light' fontSize='xs' >
                &nbsp;({stringSize(hist.statement)})
                </Text>
            </Flex>
            <Flex direction='row'>
                <Text fontSize='small'>{prettyTime(parseInt(hist.time)*1000)}</Text>
                <ExternalLinkIcon ml={2} cursor="pointer" onClick={()=>{
                    window.open(`${nameToExplorer(tableName)}/tx/${hist.id}`, '_blank')
                }}/>
            </Flex>
            </Flex>
            <Code p={1} onClick={onCopy}>
                <Text fontSize='xs' lineHeight='20px' noOfLines={4}>{hasCopied? "Copied" : hist.statement}</Text>
            </Code>
        </Flex>
    )
}
export default HistoryCard;
