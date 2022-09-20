import React from "react";
import { Tooltip, Flex, IconButton, Textarea,  Spinner, Text, Avatar, Tag, ButtonGroup, useClipboard } from "@chakra-ui/react";
import {  ArrowUpIcon, CheckIcon, LinkIcon, RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { nameToAvatar, parseTableData, toProperCase, truncateAddress } from "@/utils/stringUtils";
import { TablelandSmallIcon } from "@/public/icons";
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

const NavBar = ({tableName, tableMetadata, refresh, isLoading}) => {

  const { hasCopied, onCopy } = useClipboard(tableName);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard("https://tableland-explorer.vercel.app/"+tableName);
  const { isOpen, onOpen, onClose } = useDisclosure()

  let tableId = tableName.split('_');
  tableId = tableId[tableId.length-1];

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
          <IconButton icon={<TablelandSmallIcon  />} colorScheme='blue' variant='ghost' size="sm" />
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
                        <StatNumber>{truncateAddress(tableMetadata?.owner)}</StatNumber>
                        <StatHelpText><Link target='_blank' href={`/address/${tableMetadata?.owner}`}>Tables created by Owner</Link></StatHelpText>
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
                    <Text fontWeight={'medium'} fontSize='sm'>Token URI</Text>
                    <Text>{tableMetadata?.tokenURI}</Text>
                    </ModalBody>
                  </ModalContent>
                </Modal>

                <Tooltip hasArrow label="More Details" placement='left'>
                  <IconButton colorScheme='blue' onClick={onOpen}  icon={<InfoIcon />} disabled={isOpen} />
                </Tooltip>
              </>
            )
          }
          <Tooltip hasArrow label='View Token URI' placement='left'>
            <IconButton colorScheme='blue' onClick={()=>{
              window.open(`https://testnet.tableland.network/chain/80001/tables/${tableId}`, "_blank");
            }} icon={<ArrowUpIcon style={{'transform':'rotate(45deg)'}}/>} />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default NavBar;
