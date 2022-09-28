import React from "react";
import { Avatar, Tooltip, Flex, IconButton, Spinner, Text, Tag, useDisclosure, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { CheckIcon, LinkIcon, RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { nameToAvatar, nameToExplorer, parseTableData, prettyTime, toProperCase } from "@/utils/stringUtils";
import { SqlIcon, TablelandSmallIcon } from "@/public/icons";
import { InfoIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import DetailsModal from "./DetailsModal";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from "@chakra-ui/icons";


const NavBar = ({tableName, tableMetadata, refresh, isLoading}) => {

  const { hasCopied, onCopy } = useClipboard(tableName);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard("https://tableland-explorer.vercel.app/"+tableName);
  const { isOpen: isOpenHistory, onOpen: onOpenHistory, onClose: onCloseHistory } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  let {tableId} = parseTableData(tableName);

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
      <Flex w={{base:"100%", md:"33.33%"}} align='center' justifyContent='center'>
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
                <DetailsModal tableMetadata={tableMetadata} onClose={onClose} isOpen={isOpen}/>

                <Tooltip hasArrow label="More Details" placement='left'>
                  <IconButton colorScheme='blue' onClick={onOpen}  icon={<InfoIcon />} disabled={isOpen} />
                </Tooltip>
              </>
            )
          }

          <Drawer
              isOpen={isOpenHistory}
              placement='right'
              onClose={onCloseHistory}
            >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>History</DrawerHeader>

              <DrawerBody>
                {
                  tableMetadata && tableMetadata?.history?.sort(function(a, b){return parseInt(b.time) - parseInt(a.time)}).map(hist=>(
                    <Flex
                      direction='column'
                      key={hist.id}
                      borderWidth={1}
                      borderRadius={4}
                      borderColor='gray.100'
                      p={2}
                      _hover={{
                        borderColor: 'gray.500'
                      }}
                      mb={2}
                      cursor="pointer"
                      onClick={()=>{
                        window.open(`${nameToExplorer(tableName)}/tx/${hist.id}`, '_blank')
                      }}
                    >
                      <Flex direction='row' justifyContent='space-between'>
                        <Text fontWeight='bold' fontSize='small'>{hist.statement.split(' ')[0].toUpperCase()}</Text>
                        <Text fontSize='small'>{prettyTime(parseInt(hist.time)*1000)}</Text>
                      </Flex>
                      <Text fontSize='lg' lineHeight='20px' mt={2}>{hist.statement}</Text>
                    </Flex>
                  ))
                }
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          <Tooltip hasArrow label="History" placement='left'>
            <IconButton colorScheme='blue' onClick={onOpenHistory}  icon={<HamburgerIcon />} disabled={isOpenHistory} />
          </Tooltip>

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
