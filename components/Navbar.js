import React from "react";
import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowUpIcon } from "@chakra-ui/icons";
import Link from "next/link";

const NavBar = ({tableName}) => {

  const getExtLink = () => {
    let tableId = tableName.split('_');
    tableId = tableId[tableId.length-1];
    return `https://testnet.tableland.network/chain/80001/tables/${tableId}`;
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      py={2}
      px={4}
      background="#ececec30"
      backdropFilter="blur(10px)"
      borderBottomWidth="1px"
      height="50px"
    >
      <Link href="/">
        <Button leftIcon={<ArrowBackIcon  />} colorScheme='blue' variant='solid' size="sm">
          Back
        </Button>
      </Link>
      <Text>
        {tableName}
      </Text>
      <Link href={getExtLink()} target='_blank'>
        <IconButton icon={<ArrowUpIcon style={{transform: "rotate(45deg)"}} />} colorScheme='blue' size="sm" />
      </Link>
    </Flex>
  );
};

export default NavBar;
