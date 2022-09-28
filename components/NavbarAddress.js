import React from "react";
import { Tooltip, Flex, IconButton, Spinner, Avatar, ButtonGroup } from "@chakra-ui/react";
import { ArrowUpIcon, RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { TablelandSmallIcon } from "@/public/icons";
import AddressOrEns from "./AddressOrEns";

const NavBar = ({address, isLoading}) => {

  return (
    <Flex
      as="nav"
      justify="space-between"
      alignItems='center'
      w="100%"
      py={2}
      px={4}
      background="#fcfcfced"
      borderBottomWidth="1px"
      height="50px"
      position='fixed'
      backdropFilter='blur(4px)'
      zIndex='1000'
      top="0"
    >
      <Flex direction="row" justify="left" alignItems='center' w={{base: "fit-content", md:"33.33%"}}>
        <Link href="/">
          <TablelandSmallIcon cursor="pointer" boxSize={8}/>
        </Link>
      </Flex>
      <Flex w={{base:"100%", md:"33.33%"}} align='center' justifyContent='center'>
        <Avatar size="xs" name={address} src={`https://gradient-avatar.glitch.me/${address}`}/>
          <AddressOrEns address={address}/>
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
