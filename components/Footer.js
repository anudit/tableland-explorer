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
            {...props}
        >
            <Flex direction={{base:'column', md:'row'}} w="100%" justifyContent='space-around'>
                <Flex direction="row" w="100%" justifyContent='space-evenly' align="center">
                    <VStack align="left" spacing={0} alignItems={{base: "center", md:"start"}}>
                        <TablelandSmallIcon boxSize='80px'/>
                        <Text>Tablescan.io</Text>
                        <Text>An Explorer for the Tableland Network.</Text>
                    </VStack>
                </Flex>
                <Flex direction="row" w="100%" justifyContent='space-around' mt={{base: 8, md: 0}}>
                    <VStack align="left" spacing={4}>
                        <Heading size="md">Tablescan</Heading>
                        <Link href="/"><Text _hover={{fontWeight: 500}}>Home</Text></Link>
                        <Link href="/discover"><Text _hover={{fontWeight: 500}}>Discover</Text></Link>
                        <Link href="https://github.com/anudit/tableland-explorer" target="_blank"><Text _hover={{fontWeight: 500}}>GitHub</Text></Link>
                    </VStack>

                    <VStack align="left" spacing={4}>
                        <Heading size="md">Tableland Network</Heading>
                        <Link href="https://dev.tableland.xyz" target="_blank"><Text _hover={{fontWeight: 500}}>Blog</Text></Link>
                        <Link href="https://console.tableland.xyz" target="_blank"><Text _hover={{fontWeight: 500}}>Console</Text></Link>
                        <Link href="https://garage.tableland.xyz" target="_blank"><Text _hover={{fontWeight: 500}}>Garage</Text></Link>
                        <Link href="https://github.com/tablelandnetwork" target="_blank"><Text _hover={{fontWeight: 500}}>GitHub</Text></Link>
                    </VStack>
                </Flex>

            </Flex>
        </Flex>
    )
}
export default Footer;
