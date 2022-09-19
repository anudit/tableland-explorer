import React, { useEffect, useState } from "react";
import { Tooltip, Button, Flex, IconButton, Text, Avatar, Tag, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowUpIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { nameToAvatar, toProperCase } from "@/utils/stringUtils";
import { CopyIcon } from "@chakra-ui/icons";
import { CheckIcon } from "@chakra-ui/icons";
import { LinkIcon } from "@chakra-ui/icons";

const NavBar = ({tableName}) => {

  const { hasCopied, onCopy } = useClipboard(tableName);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard("https://tableland-explorer.vercel.app/"+tableName);

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
      <Link href="/">
        <Button leftIcon={<ArrowBackIcon  />} colorScheme='facebook' variant='ghost' size="sm">
          Back
        </Button>
      </Link>
      <Flex direction="row" justify="center" alignItems='center'>
        <Avatar size="sm" bg='whiteAlpha.500' src={nameToAvatar(tableName)} />
        <Text ml="4" fontWeight={'medium'}>
          {toProperCase(tableName.split("_").slice(0,-2).join(' '))}
          <Tag size='sm' mt="3px" ml={2}>#{tableId}</Tag>
        </Text>
        <IconButton onClick={onCopy} icon={hasCopied ? <CheckIcon /> : <CopyIcon />} variant="ghost" size='sm' />
      </Flex>
      <ButtonGroup size='sm' isAttached variant='ghost'>
        <Tooltip hasArrow label={hasCopiedLink ? "Copied" : "Share Link"} placement='left'>
          <IconButton colorScheme='facebook' onClick={onCopyLink} icon={hasCopiedLink ? <CheckIcon /> : <LinkIcon />} />
        </Tooltip>
        <Tooltip hasArrow label='View Token URI' placement='left'>
          <IconButton colorScheme='facebook' onClick={()=>{
            window.open(`https://testnet.tableland.network/chain/80001/tables/${tableId}`, "_blank");
          }} icon={<ArrowUpIcon style={{'transform':'rotate(45deg)'}}/>} />
        </Tooltip>
      </ButtonGroup>
    </Flex>
  );
};

export default NavBar;
