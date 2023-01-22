import React, { useEffect, useState } from "react";
import { Spinner, Image, Heading, SimpleGrid , Button, useColorMode, Flex, Text, IconButton } from "@chakra-ui/react";

import Balancer from 'react-wrap-balancer';
import UniversalSearch from "@/components/UniversalSearch";
import Link from "next/link";
import { TwitterIcon } from "@/public/icons";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getProjects } from "@/utils/rigs";

export default function DiscoverPage() {

    const { colorMode } = useColorMode();
    const [projectList, setProjectList] = useState(false);

    useEffect(()=>{
        getProjects().then(setProjectList);
    }, [])


    return (
        <Flex
            direction='column'
            fontFamily='inherit'
            backgroundImage="url(/lightbackground.png)"
            backgroundRepeat="no-repeat"
            backgroundPosition="top right"
            backgroundAttachment="fixed"
        >
            <UniversalSearch />
            <Flex h="400px" justifyContent="center" direction="column" alignItems='center'>
                <Heading size="3xl" align="center">Explore the Tableverse</Heading>
            </Flex>
            {
                projectList != false ? (
                    <SimpleGrid
                        columns={{base: 1, md: 2, lg: 3}}
                        spacing='20px'
                        m={2}
                        px={{base: "2%", sm: "7%", md: "10%", lg: "15%"}}
                    >
                        {
                            projectList.map((project, id)=>{
                                return (
                                    <Flex
                                        key={id}
                                        direction='column'
                                        borderStyle="solid"
                                        borderWidth="2px"
                                        borderRadius="40px"
                                        borderColor={colorMode === 'light' ? 'gray.200': 'gray.700'}
                                        _hover={{
                                            translateX:'-5px',
                                            transition: 'all 0.5s',
                                            borderColor: colorMode === 'light' ? '#0004': '#ffffffaa'
                                        }}
                                    >
                                        <Image src={project.poster} height='300px' width="100%" borderTopRadius="38px" />
                                        <Flex direction='column' p={6} justifyContent='space-between' h="100%">
                                            <Flex direction='column'>
                                                <Heading size='lg' pb={2} noOfLines={1} fontWeight={600}>{project.name}</Heading>
                                                <Text noOfLines={3}>
                                                    <Balancer>
                                                        {project.description}
                                                    </Balancer>
                                                </Text>
                                            </Flex>
                                            <Flex direction='row' mt={2} justifyContent="space-between">
                                                <Link href={project.url} target="_blank" w="100%">
                                                    <Button borderRadius='40px' w="100%" variant="outline" leftIcon={<ExternalLinkIcon/>}>
                                                        {new URL(project.url).hostname.replace('www.','')}
                                                    </Button>
                                                </Link>
                                                {
                                                    project?.twitter && (
                                                        <Link href={project.twitter} target="_blank" w="100%">
                                                            <IconButton
                                                                icon={<TwitterIcon/>}
                                                                variant="ghost"
                                                                borderRadius='40px'
                                                                _hover={{
                                                                    color: '#1DA1F2'
                                                                }}
                                                            />
                                                        </Link>
                                                    )
                                                }
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )
                            })
                        }
                    </SimpleGrid>
                ) : (
                    <Flex
                        direction='column'
                        minH="50vh"
                        align='center'
                    >
                        <Flex direction='row'>
                        <Spinner mr={4} /> <Text>Fetching Projects</Text>
                        </Flex>
                    </Flex>
                )
            }
        </Flex>
    )

}


