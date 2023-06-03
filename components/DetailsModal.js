import React from 'react';
import { useColorMode, Avatar, chakra, Flex, Text } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { isMainnetTable, nameToAvatar, nameToChainName, nameToExplorer, parseTableData } from "@/utils/stringUtils";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Stat, StatLabel, StatNumber, StatHelpText, StatGroup } from '@chakra-ui/react';
import AddressOrEns from './AddressOrEns';
import EnsAvatar from './EnsAvatar';
import timeAgo from '@/utils/stringUtils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { format } from 'sql-formatter';

const DetailsModal = ({tableMetadata, isOpen, onClose}) => {
    const { colorMode } = useColorMode();

    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropBlur='2px'/>
                <ModalContent>
                <ModalHeader>{tableMetadata?.name} Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <StatGroup>
                    <Stat>
                    <StatLabel>Table Id</StatLabel>
                    <StatNumber>{parseTableData(tableMetadata?.name).tableId}</StatNumber>
                    <StatHelpText>{tableMetadata?.historyCount} Operation{tableMetadata?.historyCount==1?"":"s"}</StatHelpText>
                    </Stat>

                    <Stat>
                    <StatLabel>Chain Id</StatLabel>
                    <StatNumber display='flex' alignItems="center"> <Avatar size='xs' src={nameToAvatar(tableMetadata?.name)} mr={2} />{parseTableData(tableMetadata?.name).chainId}</StatNumber>
                    <StatHelpText>{nameToChainName(tableMetadata?.name)}</StatHelpText>
                    </Stat>
                </StatGroup>
                <StatGroup>

                    <Stat>
                    <StatLabel>Last Updated On</StatLabel>
                    <StatNumber>{new Date(parseInt(tableMetadata?.lastUpdated)*1000).toLocaleDateString()}</StatNumber>
                    <StatHelpText>{new Date(parseInt(tableMetadata?.lastUpdated)*1000).toLocaleTimeString()} ({timeAgo(new Date(parseInt(tableMetadata?.lastUpdated)*1000))})</StatHelpText>
                    </Stat>
                    <Stat>
                    <StatLabel>Created On</StatLabel>
                    <StatNumber>{new Date(parseInt(tableMetadata?.created)*1000).toLocaleDateString()}</StatNumber>
                    <StatHelpText>{new Date(parseInt(tableMetadata?.created)*1000).toLocaleTimeString()} ({timeAgo(new Date(parseInt(tableMetadata?.created)*1000))})</StatHelpText>
                    </Stat>

                </StatGroup>

                <br/>

                <StatGroup>
                    <Stat>
                    <StatLabel>Owner</StatLabel>
                    <Link target='_blank' href={`/address/${tableMetadata?.owner?.id}`}>
                        <chakra.div cursor="pointer">
                            <StatNumber>
                                <Flex direction="row" py={2} alignItems="center">
                                    <EnsAvatar address={tableMetadata?.owner?.id}/>
                                    <Flex direction="column" mx={2}>
                                        <Text fontSize='xs' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                            View tables by Owner
                                        </Text>
                                        <AddressOrEns ml={0} mt="-4px" size={{base: 'xs', md: 'sm'}} address={tableMetadata?.owner?.id} tooltip={false}/>
                                    </Flex>
                                </Flex>
                            </StatNumber>
                        </chakra.div>
                    </Link>
                    </Stat>

                    <Stat>
                    <StatLabel>Controller</StatLabel>
                    <Link target='_blank' href={`/address/${tableMetadata?.controller?.id}`}>
                        <chakra.div cursor="pointer">
                            <StatNumber>
                                <Flex direction="row" py={2} alignItems="center">
                                    <EnsAvatar address={tableMetadata?.controller?.id}/>
                                    <Flex direction="column" mx={2}>
                                        <Text fontSize='xs' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                            View tables by Controller
                                        </Text>
                                        <AddressOrEns ml={0} mt="-4px" size={{base: 'xs', md: 'sm'}} address={tableMetadata?.controller?.id} tooltip={false}/>
                                    </Flex>
                                </Flex>
                            </StatNumber>
                        </chakra.div>
                    </Link>
                    </Stat>

                </StatGroup>
                <br/>

                <Text fontWeight={'medium'} fontSize='sm' mb={1}>Creation Statement</Text>
                <SyntaxHighlighter language="sql" style={atomOneDark} wrapLongLines={true} wrapLines={true} customStyle={{
                    borderRadius: '10px',
                    fontSize: '12px'
                }}>
                    {format(String(tableMetadata?.statement).replaceAll('[', '').replaceAll(']', '') || "", { language: 'mysql'})}
                </SyntaxHighlighter>
                <br/>

                <Flex direction='row' justifyContent='space-between'>
                    <Link href={tableMetadata?.tokenURI} target="_blank">
                        <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' _hover={{'textDecoration': 'underline'}}>
                            Token URI <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                        </Text>
                    </Link>

                    <Link href={`https://render.tableland.xyz/${parseTableData(tableMetadata?.name).chainId}/${parseTableData(tableMetadata?.name)?.tableId}`} target="_blank">
                        <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' _hover={{'textDecoration': 'underline'}}>
                            Image Link <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                        </Text>
                    </Link>

                    <Link href={`${nameToExplorer(tableMetadata?.name)}/tx/`+tableMetadata?.txnHash} target="_blank">
                        <Text cursor="pointer" fontWeight={'medium'} fontSize='sm'_hover={{'textDecoration': 'underline'}}>
                            Creation Txn <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                        </Text>
                    </Link>

                    <Link href={`https://${isMainnetTable(tableMetadata?.name) ? '' : 'testnets.'}tableland.network/api/v1/query?mode=objects&statement=select%20*%20from%20${tableMetadata?.name}`} target="_blank">
                        <Text cursor="pointer" fontWeight={'medium'} fontSize='sm'_hover={{'textDecoration': 'underline'}}>
                            Raw <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                        </Text>
                    </Link>
                </Flex>

                <br/>
            </ModalBody>
            </ModalContent>
        </Modal>

    )
}

export default DetailsModal;
