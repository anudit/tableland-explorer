import React, { useEffect, useState } from "react";
import { Spinner, Image, Heading, SimpleGrid , Button, useColorMode, Flex, Text, IconButton } from "@chakra-ui/react";

import Balancer from 'react-wrap-balancer';
import Link from "next/link";
import { TwitterIcon } from "@/public/icons";
import { ExternalIcon } from "@/public/icons";
import { getProjects } from "@/utils/rigs";
import DiscoverCarousel from "@/components/DiscoverCarousel";
import PageShell from "@/components/PageShell";

const chooseRandom = (arr, num = 5) => {
    const res = [];
    for(let i = 0; i < num; ){
       const random = Math.floor(Math.random() * arr.length);
       if(res.indexOf(arr[random]) !== -1){
          continue;
       }
       res.push(arr[random]);
       i++;
    }
    return res;
 };

export default function DiscoverPage() {

    const { colorMode } = useColorMode();
    const [projectList, setProjectList] = useState(false);

    useEffect(()=>{
        getProjects().then(setProjectList);
    }, [])


    return (
        <PageShell title="Discover the Tableverse - Tablescan.io">
            {
                projectList != false ? (
                    <>
                        <DiscoverCarousel projects={chooseRandom(projectList.filter(e=>e?.poster!=""))} />
                        <Flex py={16} justifyContent="center" direction="column" alignItems='center'>
                            <Heading size="3xl" align="center">Explore the Tableverse</Heading>
                        </Flex>
                        <SimpleGrid
                            columns={{base: 1, md: 2, lg: 3}}
                            spacing='20px'
                            m={2}
                            px={{base: "2%", sm: "7%", md: "10%", lg: "15%"}}
                        >
                            {
                                projectList.sort((a, b)=>a.name.toLowerCase().charCodeAt(0) - b.name.toLowerCase().charCodeAt(0)).map((project, id)=>{
                                    return (
                                        <Flex
                                            key={id}
                                            direction='column'
                                            borderStyle="solid"
                                            borderWidth="2px"
                                            borderRadius="20px"
                                            borderColor='transparent'
                                            background={colorMode === 'light' ? '#fcfcfcdb' : '#0a0a0a9e'}
                                            _hover={{
                                                translateX:'-5px',
                                                transition: 'all 0.5s',
                                                borderColor: colorMode === 'light' ? '#0004': '#ffffffaa'
                                            }}
                                        >
                                            <Image src={project.poster === "" ? `https://tablescan.io/api/og?title=${encodeURIComponent(project?.name.toLowerCase())}` : project.poster} height='300px' width="100%" borderTopRadius="18px" />
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
                                                    <Link href={`${project.url}?ref=tablescan.io`} target="_blank" w="100%">
                                                        <Button borderRadius='40px' w="100%" variant="outline" leftIcon={<ExternalIcon/>}>
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
                    </>
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
        </PageShell>
    )

}


