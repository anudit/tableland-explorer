import React from "react";
import { Tooltip, Flex, IconButton, Spinner, Text, Avatar, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { ArrowUpIcon, RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { truncateAddress } from "@/utils/stringUtils";
import { TablelandSmallIcon } from "@/public/icons";

const NavBar = ({address, isLoading}) => {

  const { hasCopied, onCopy } = useClipboard(address);

  return (
    <Flex
      as="nav"
      justify="space-between"
      alignItems='center'
      w="100%"
      py={2}
      px={4}
      background="#ffffffed"
      borderBottomWidth="1px"
      height="50px"
      position='fixed'
      backdropBlur='xl'
      zIndex='1000'
      top="0"
    >
      <Flex direction="row" justify="left" alignItems='center' w={{base: "fit-content", md:"33.33%"}}>
        <Link href="/">
          <TablelandSmallIcon cursor="pointer" boxSize={8}/>
        </Link>
      </Flex>
      <Flex w="33.33%" align='center' justifyContent='center'>
        <Avatar size="xs" name={address} src={`https://gradient-avatar.glitch.me/${address}`}/>
        <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Address"} placement='bottom'>
          <Text ml="4" fontWeight={'medium'} onClick={onCopy} cursor="pointer" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {truncateAddress(address)}
          </Text>
        </Tooltip>
      </Flex>
      <Flex direction="row" justify="right" alignItems='center' w={{base: "fit-content", md:"33.33%"}} align='right'>
        <ButtonGroup size='sm' isAttached variant='ghost'>
          <Tooltip hasArrow label={isLoading ? "Refreshing Data" : "Refresh Data"} placement='left'>
            <IconButton colorScheme='facebook' icon={isLoading ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isLoading}/>
          </Tooltip>
          <Tooltip hasArrow label='View on Etherscan' placement='left'>
            <IconButton colorScheme='facebook' onClick={()=>{
              window.open(`https://blockscan.com/address/${address}`, "_blank");
            }} icon={<ArrowUpIcon style={{'transform':'rotate(45deg)'}}/>} />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default NavBar;
