import React from "react";
import { Code, Flex, Text, useClipboard } from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon, CheckIcon } from "@chakra-ui/icons";
import { nameToExplorer, prettyTime, stringSize } from "@/utils/stringUtils";

const HistoryCard = ({tableName, hist}) => {
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
        >
            <Flex direction='row' justifyContent='space-between' mb={2}>
            <Flex direction='row'>
                <Text fontWeight='bold' fontSize='small'>
                {hist.statement.split(' ')[0].toUpperCase()}
                </Text>
                <Text fontWeight='light' fontSize='xs' >
                &nbsp;({stringSize(hist.statement)})
                </Text>
            </Flex>
            <Flex direction='row'>
                <Text fontSize='small'>{prettyTime(parseInt(hist.time)*1000)}</Text>
                <ExternalLinkIcon ml={2} cursor="pointer" onClick={()=>{
                    window.open(`${nameToExplorer(tableName)}/tx/${hist.id}`, '_blank')
                }}/>
                {hasCopied ? <CheckIcon ml={2} /> : <CopyIcon ml={2} onClick={onCopy} cursor="pointer"/>}
            </Flex>
            </Flex>
            <Code p={1}>
            <Text fontSize='xs' lineHeight='20px' noOfLines={4}>{hist.statement}</Text>
            </Code>
        </Flex>
    )
}
export default HistoryCard;
