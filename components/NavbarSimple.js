import React from "react";
import { useColorModeValue, useColorMode, Tooltip, Flex, IconButton, Spinner, ButtonGroup } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { TablelandSmallIcon } from "@/public/icons";
import { MoonIcon } from "@chakra-ui/icons";
import { SunIcon } from "@chakra-ui/icons";

const NavBar = ({isLoading, refresh}) => {
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
        <ButtonGroup size='sm' isAttached variant='ghost'>
          <Tooltip hasArrow label={isLoading ? "Refreshing Data" : "Refresh Data"} placement='left'>
            <IconButton icon={isLoading ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isLoading} onClick={refresh}/>
          </Tooltip>
          <IconButton onClick={toggleColorMode}  icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />} />
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default NavBar;