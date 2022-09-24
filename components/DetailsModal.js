import React from 'react';
import { Avatar, chakra, Flex, Textarea, Text } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { nameToAvatar, nameToChainName, nameToExplorer, parseTableData, truncateAddress } from "@/utils/stringUtils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from '@chakra-ui/react';

const DetailsModal = ({tableMetadata, isOpen, onClose}) => {
    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>{tableMetadata?.name} Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <StatGroup>
                    <Stat>
                    <StatLabel>Table Id</StatLabel>
                    <StatNumber>{parseTableData(tableMetadata?.name).tableId}</StatNumber>
                    </Stat>

                    <Stat>
                    <StatLabel>Chain Id</StatLabel>
                    <StatNumber display='flex' alignItems="center"> <Avatar size='xs' src={nameToAvatar(tableMetadata?.name)} mr={2} />{parseTableData(tableMetadata?.name).chainId}</StatNumber>
                    <StatHelpText>{nameToChainName(tableMetadata?.name)}</StatHelpText>
                    </Stat>

                    <Stat>
                    <StatLabel>Created On</StatLabel>
                    <StatNumber>{new Date(parseInt(tableMetadata?.created)*1000).toLocaleDateString()}</StatNumber>
                    <StatHelpText>{new Date(parseInt(tableMetadata?.created)*1000).toLocaleTimeString()}</StatHelpText>
                    </Stat>

                </StatGroup>

                <br/>

                <StatGroup>
                    <Stat>
                    <StatLabel>Owner</StatLabel>
                    <Link target='_blank' href={`/address/${tableMetadata?.owner}`}>
                        <chakra.div cursor="pointer">
                        <StatNumber>{truncateAddress(tableMetadata?.owner)}</StatNumber>
                        <StatHelpText>View tables by Owner</StatHelpText>
                        </chakra.div>
                    </Link>
                    </Stat>

                    <Stat>
                    <StatLabel>Controller</StatLabel>
                    <Link target='_blank' href={`/address/${tableMetadata?.controller}`}>
                        <chakra.div cursor="pointer">
                        <StatNumber>{truncateAddress(tableMetadata?.controller)}</StatNumber>
                        <StatHelpText>View tables by Controller</StatHelpText>
                        </chakra.div>
                    </Link>
                    </Stat>

                </StatGroup>
                <br/>

                <Text fontWeight={'medium'} fontSize='sm'>Creation Statement</Text>
                <Textarea
                    value={tableMetadata?.statement}
                    size='sm'
                    readOnly
                />
                <br/><br/>

                <Flex direction='row' justifyContent='space-between'>
                    <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' onClick={()=>{
                        window.open(tableMetadata?.tokenURI, '_blank')
                    }} _hover={{'textDecoration': 'underline'}}>
                        Token URI <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                    </Text>

                    <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' onClick={()=>{
                        window.open(`https://render.tableland.xyz/${parseTableData(tableMetadata?.name).chainId}/${parseTableData(tableMetadata?.name)?.tableId}`, '_blank')
                    }} _hover={{'textDecoration': 'underline'}}>
                        Image Link <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                    </Text>

                    <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' onClick={()=>{
                        window.open(`${nameToExplorer(tableMetadata?.name)}/tx/`+tableMetadata?.txnHash, '_blank')
                    }} _hover={{'textDecoration': 'underline'}}>
                        Creation Txn <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                    </Text>

                    <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' onClick={()=>{
                        window.open(`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableMetadata?.name}`, '_blank')
                    }} _hover={{'textDecoration': 'underline'}}>
                        Raw <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                    </Text>
                </Flex>

                <br/>
            </ModalBody>
            </ModalContent>
        </Modal>

    )
}

export default DetailsModal;
