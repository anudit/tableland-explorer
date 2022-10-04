import React, {useState} from "react";
import { Avatar, Tooltip, Flex, Button, IconButton, Spinner, Text, Tag, useDisclosure, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { CheckIcon, LinkIcon, RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { freqTable, nameToAvatar, parseTableData, toProperCase } from "@/utils/stringUtils";
import { FilterIcon, SqlIcon, TablelandSmallIcon } from "@/public/icons";
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
import HistoryCard from "./HistoryCard";


const NavBar = ({tableName, tableMetadata, refresh, isLoading}) => {

  const { hasCopied, onCopy } = useClipboard(tableName);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard("https://tableland-explorer.vercel.app/"+tableName);
  const { isOpen: isOpenHistory, onOpen: onOpenHistory, onClose: onCloseHistory } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [disabledFilter, setDisabledFilter] = useState(new Set([]));

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
              size='md'
            >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton mt="7px"/>
              <DrawerHeader>History</DrawerHeader>

              <DrawerBody>
                <Flex w="100%" justifyContent='center' alignItems='center'>
                  <FilterIcon mr={2}/>
                  {
                    tableMetadata && tableMetadata?.history && (
                      <ButtonGroup size='sm' isAttached >
                        {
                          Object.entries(freqTable(tableMetadata?.history.map(e=>e.statement.split(' ')[0].toUpperCase()))).map(([key, val])=>(
                            <Button
                              key={key}
                              colorScheme={disabledFilter.has(key) ? 'gray': null}
                              variant={disabledFilter.has(key) ? 'ghost': 'solid'}
                              onClick={()=>{
                                setDisabledFilter(df=>{
                                  if (df.has(key)) {
                                    let ndf =  df;
                                    ndf.delete(key)
                                    console.log('setting', ndf)
                                    return ndf;
                                  }
                                  else {
                                    let ndf = df;
                                    ndf.add(key);
                                    console.log('setting', ndf)
                                    return ndf;
                                  }
                                })
                              }}
                            >
                              {key}
                              <Tag ml={2} size='sm' colorScheme='blue'>{val}</Tag>
                            </Button>
                          ))
                        }
                      </ButtonGroup>
                    )
                  }
                </Flex>
                <br/>
                {
                  tableMetadata && tableMetadata?.history?.sort(function(a, b){return parseInt(b.time) - parseInt(a.time)}).map(hist=>(
                    <HistoryCard
                      tableName={tableName}
                      hist={hist}
                      display={disabledFilter.has(hist?.statement.split(' ')[0].toUpperCase()) ? 'none' : 'flex'}
                      key={hist.id}
                    />
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
