import React from "react";
import { Tooltip, Spinner, useColorModeValue, useColorMode, Flex, IconButton, ButtonGroup } from "@chakra-ui/react";
import Link from "next/link";
import { TablelandSmallIcon } from "@/public/icons";
import { RepeatIcon, MoonIcon } from "@chakra-ui/icons";
import { SunIcon } from "@chakra-ui/icons";

const NavBar = ({refresh, isLoading}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      as="nav"
      justify="space-between"
      alignItems='center'
      w="100%"
      py={2}
      px={4}
      background={useColorModeValue('#fcfcfcdb', '#0000005e')}
      backdropFilter='blur(20px)'
      height="50px"
      position='fixed'
      zIndex='1000'
      top="0"
    >
      <Flex direction="row" justify="left" alignItems='center' w={{base: "fit-content", md:"33.33%"}}>
        <Link href="/">
          <TablelandSmallIcon cursor="pointer" boxSize={8}/>
        </Link>
      </Flex>
      <Flex direction="row" justify="right" alignItems='center' w={{base: "fit-content", md:"33.33%"}} align='right'>
        <Tooltip hasArrow label={isLoading ? "Refreshing Data" : "Refresh Data"} placement='left'>
          <IconButton variant="ghost" onClick={refresh} icon={isLoading ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isLoading}/>
        </Tooltip>
        <ButtonGroup size='sm' isAttached variant='ghost'>
          <IconButton onClick={toggleColorMode}  icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />} />
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default NavBar;
