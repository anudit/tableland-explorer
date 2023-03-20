import React from "react";
import { useColorMode, Heading, VStack, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { TablelandSmallIcon } from "@/public/icons";

const Footer = ({ ...props}) => {

    const { colorMode } = useColorMode();

    return (
        <Flex
            direction='column'
            justifyContent='space-around'
            alignItems='flex-start'
            background={colorMode === 'dark' ? 'black' : 'white'}
            px={8}
            py={16}
            _hover={{
                borderColor: 'gray.500'
            }}
            w="100%"
            {...props}
        >
            <Flex direction={{base:'column', md:'row'}} w="100%" justifyContent='space-around'>
                <Flex direction="row" w="100%" justifyContent='space-evenly' align="center">
                    <VStack align="left" spacing={0} alignItems={{base: "center", md:"start"}}>
                        <TablelandSmallIcon boxSize='80px'/>
                        <Text><b>Tablescan.io</b></Text>
                        <Text>An Explorer for the Tableland Network.</Text>
                    </VStack>
                </Flex>
                <Flex direction="row" w="100%" justifyContent='space-around' mt={{base: 8, md: 0}}>
                    <VStack align="left" spacing={4}>
                        <Heading fontSize="20px">Tablescan</Heading>
                        <Link href="/"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>Home</Text></Link>
                        <Link href="/discover"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>Discover</Text></Link>
                        <Link href="https://github.com/anudit/tableland-explorer" target="_blank"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>GitHub</Text></Link>
                    </VStack>

                    <VStack align="left" spacing={4}>
                        <Heading fontSize="20px">Tableland Network</Heading>
                        <Link href="https://dev.tableland.xyz" target="_blank"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>Tech Blog</Text></Link>
                        <Link href="https://console.tableland.xyz" target="_blank"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>Console</Text></Link>
                        <Link href="https://garage.tableland.xyz" target="_blank"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>Garage</Text></Link>
                        <Link href="https://github.com/tablelandnetwork" target="_blank"><Text _hover={{fontWeight: 500, textDecoration: 'underline'}}>GitHub</Text></Link>
                    </VStack>
                    <VStack align="left" spacing={4}></VStack>
                </Flex>

            </Flex>
        </Flex>
    )
}
export default Footer;
