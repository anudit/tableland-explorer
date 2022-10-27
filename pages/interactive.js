import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDisclosure, Alert, AlertIcon, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Grid } from "@anudit/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import NavBar from '../components/NavbarInteractive';
import Meta from '@/components/Meta';

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
  } from '@chakra-ui/react'
import { Textarea , Box, Text, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'
import sdk from 'postman-collection';
const codegen = require('postman-code-generators')

const InteractiveView = () => {

    const router = useRouter();
    const { query } = router.query;
    const [refreshing, setRefreshing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [snippets, setSnippets] = useState(false);

    const { data, error, mutate, isValidating } = useSWR(
        query ? [`https://testnet.tableland.network/query?mode=json&s=${query}`] : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://testnet.tableland.network/query?mode=json&s=${query}`);
        mutate(data);
        setRefreshing(false);
    }

    async function getCode(lang, variant){
        let promise = new Promise((res, rej) => {

            codegen.convert(
                lang,
                variant,
                new sdk.Request(`https://testnet.tableland.network/query?mode=json&s=${encodeURIComponent(query)}`),
                {
                    indentCount: 3,
                    indentType: 'Space',
                    trimRequestBody: true,
                    followRedirect: true
                },
                function(error, snippet) {
                    if (error){
                        rej(error);
                    }
                    else{
                        res(snippet);
                    }
                }
            )

        });
        let result = await promise;
        return result;
    }

    useEffect(()=>{
        async function getData(){
            if (query){
                let snips = {};
                let langs = codegen.getLanguageList();
                for (let index = 0; index < langs.length; index++) {
                    snips[langs[index].key] = {};
                    const lang = langs[index];
                    for (let j = 0; j < lang.variants.length; j++) {
                        const {key: variant} = lang.variants[j];
                        let code = await getCode(lang.key, variant);
                        snips[langs[index].key][variant] = code;
                    }
                }
                setSnippets(snips);
            }
        }
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[query])

    if (error) return <div>failed to load, {error}</div>;
    return (
        <>
            <Meta/>
            <NavBar refresh={refresh} isLoading={refreshing || isValidating} onOpen={onOpen}/>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Code snippet</DrawerHeader>

                    <DrawerBody>
                        <Accordion>
                            {
                                snippets && Object.keys(snippets).map(lang=>{
                                    return (
                                        <AccordionItem key={lang.key}>
                                            <AccordionButton>
                                                <Box flex='1' textAlign='left'>
                                                    {lang}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel pb={4}>
                                                {
                                                    Object.keys(snippets[lang]).map(variant=>{
                                                        return (
                                                            <>
                                                                <Text mb={1} fontSize="sm">{variant}</Text>
                                                                <Textarea w="100%" noOfLines={4} isDisabled>
                                                                    {snippets[lang][variant]}
                                                                </Textarea >
                                                            </>
                                                        )
                                                    })
                                                }
                                            </AccordionPanel>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                    {
                    data ? data?.message ? (
                        <Alert status='error'>
                            <AlertIcon />
                            {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                        </Alert>
                    ) : (
                        <chakra.div color="black !important" position="relative" height="calc(100vh - 50px)" width="100%">
                            <Grid data={data} downloadFilename='custom' />
                        </chakra.div>
                    ) : (
                        <Flex w="100%" h="calc(100vh - 50px)" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
            </chakra.div>
        </>
    )

}

export default InteractiveView;
