import React from "react";
import { chakra, Tooltip, Flex, IconButton, Textarea,  Spinner, Text, Avatar, Tag, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { ArrowUpIcon, CheckIcon, LinkIcon, RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { nameToAvatar, nameToExplorer, parseTableData, toProperCase, truncateAddress } from "@/utils/stringUtils";
import { SqlIcon, TablelandSmallIcon } from "@/public/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { InfoIcon } from "@chakra-ui/icons";

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from '@chakra-ui/react'
import { useRouter } from "next/router";

const NavBar = ({tableName, tableMetadata, refresh, isLoading}) => {

  const { hasCopied, onCopy } = useClipboard(tableName);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard("https://tableland-explorer.vercel.app/"+tableName);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter();

  let {tableId, chainId} = parseTableData(tableName);

  return (
    <Flex
      as="nav"
      justify="space-between"
      alignItems='center'
      w="100%"
      py={2}
      px={4}
      background="#ececec30"
      borderBottomWidth="1px"
      height="50px"
    >
      <Flex direction="row" justify="left" alignItems='center' w={{base: "fit-content", md:"33.33%"}}>
        <Link href="/">
          <TablelandSmallIcon cursor="pointer" boxSize={8}/>
        </Link>
      </Flex>
      <Flex w="33.33%" align='center' justifyContent='center'>
        <Avatar size="xs" bg='whiteAlpha.500' src={nameToAvatar(tableName)} />
        <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Full Name"} placement='bottom'>
          <Text ml="4" fontWeight={'medium'} onClick={onCopy} cursor="pointer" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {toProperCase(tableName.split("_").slice(0,-2).join(' '))}
          </Text>
        </Tooltip>
        <Tag size='sm' mt="3px" ml={2}>#{tableId}</Tag>
      </Flex>
      <Flex direction="row" justify="right" alignItems='center' w={{base: "fit-content", md:"33.33%"}} align='right'>
        <ButtonGroup size='sm' isAttached variant='ghost'>
          <Tooltip hasArrow label={isLoading ? "Refreshing Data" : "Refresh Data"} placement='left'>
            <IconButton colorScheme='blue' onClick={refresh} icon={isLoading ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isLoading}/>
          </Tooltip>
          <Tooltip hasArrow label={hasCopiedLink ? "Copied" : "Share Link"} placement='left'>
            <IconButton colorScheme='blue' onClick={onCopyLink} icon={hasCopiedLink ? <CheckIcon /> : <LinkIcon />} />
          </Tooltip>


          {
            tableMetadata && (
              <>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{tableMetadata?.name} Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <StatGroup>
                      <Stat>
                        <StatLabel>Table Id</StatLabel>
                        <StatNumber>{parseTableData(tableName).tableId}</StatNumber>
                      </Stat>

                      <Stat>
                        <StatLabel>Chain Id</StatLabel>
                        <StatNumber>{parseTableData(tableName).chainId}</StatNumber>
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
                        <StatLabel>Created On</StatLabel>
                        <StatNumber>{new Date(parseInt(tableMetadata?.created)*1000).toLocaleDateString()}</StatNumber>
                        <StatHelpText>{new Date(parseInt(tableMetadata?.created)*1000).toLocaleTimeString()}</StatHelpText>
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
                        window.open(`https://render.tableland.xyz/${chainId}/${tableId}`, '_blank')
                      }} _hover={{'textDecoration': 'underline'}}>
                        Image Link <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                      </Text>

                      <Text cursor="pointer" fontWeight={'medium'} fontSize='sm' onClick={()=>{
                        window.open(`${nameToExplorer(tableName)}/tx/`+tableMetadata?.id, '_blank')
                      }} _hover={{'textDecoration': 'underline'}}>
                        Creation Txn <ArrowUpIcon mb={1} style={{'transform': 'rotate(45deg)'}}/>
                      </Text>
                    </Flex>

                    <br/>
                    </ModalBody>
                  </ModalContent>
                </Modal>

                <Tooltip hasArrow label="More Details" placement='left'>
                  <IconButton colorScheme='blue' onClick={onOpen}  icon={<InfoIcon />} disabled={isOpen} />
                </Tooltip>
              </>
            )
          }

              <Tooltip hasArrow label='Interactive SQL Mode' placement='left'>
                  <SqlIcon color='blue.600' boxSize={8} p={1} cursor="pointer" onClick={()=>{
                    router.push(`/interactive?query=${encodeURIComponent('SELECT * from ')}${tableName}`)
                  }}/>
              </Tooltip>

        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default NavBar;
