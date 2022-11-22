import { Grid } from "@anudit/flat-ui";
import { Alert, AlertIcon, chakra, Flex, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useSWR from "swr";

import Meta from '@/components/Meta';
import fetcher from '@/utils/fetcher';
import NavBar from '../components/NavbarInteractive';

import { TablelandSmallIcon } from '@/public/icons';
import { CloseIcon, SmallAddIcon } from '@chakra-ui/icons';
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Text, Textarea, useColorMode
} from '@chakra-ui/react';
import Link from 'next/link';
import sdk from 'postman-collection';
import { TerminalIcon } from '@/public/icons';
const codegen = require('postman-code-generators')

const InteractiveView = () => {

    const router = useRouter();
    const { query, name } = router.query;
    const [tabsData, setTabsData] = useState([{name: 'New Query', id: 0}]);
    const { colorMode } = useColorMode();

    useEffect(()=>{
        console.log('tabs now', tabsData)
    },[tabsData])


    function closeTab(tabId){
        setTabsData((oldData)=>{
            return oldData.filter(e=>e['id']!=tabId);
        })
    }

    function newTab(){
        setTabsData((oldData)=>{
            let newData = [].concat(oldData);
            let newId = Math.max(...oldData.map(e=>e.id))+1;
            newData.push({name: `Query ${newId}`, id: newId});
            return newData;
        })
    }

    function updateTabName(tabId, newName){
        setTabsData((oldData)=>{

            if (oldData.filter(e=>e.id == tabId).length >0){
                let newData = [].concat(oldData);
                newData[tabId] = {...newData[tabId], name: newName};
                return newData;
            }
            else {
                return oldData;
            }
        })
    }

    return (
        <>
            <Meta/>
            <Tabs defaultIndex={0} variant='enclosed' w="100%" colorScheme={colorMode === 'dark' ? 'white': 'black'}>
                <TabList display='flex' alignItems='center' direction="row" w="100%" overflowX='auto' h="50px" borderBottom='none'>
                    <Link href="/">
                        <TablelandSmallIcon cursor="pointer" boxSize={6} mx={3}/>
                    </Link>
                    {
                        tabsData.map((val)=>
                        <Tab key={val.id} borderBottom="none" borderRadius={0}>
                            <TerminalIcon boxSize={4} mr={2}/>
                            <Text noOfLines={1}  suppressContentEditableWarning={true} contentEditable="true" onKeyDown={(e)=>{
                                updateTabName(val.id, e.currentTarget.innerText);
                            }}>{val.name}</Text>
                            <Box as='span' ml='2'>
                            <CloseIcon boxSize={2} _hover={{color: "red"}} onClick={()=>{
                                closeTab(val.id)
                            }}/>
                            </Box>
                        </Tab>
                        )
                    }
                    <SmallAddIcon boxSize={6} mx={2} cursor="pointer" onClick={newTab} />
                </TabList>
                <TabPanels>
                    {
                        tabsData.map((val)=>(
                            <TabPanel key={val.id} p={0}>
                                <TabView
                                    defaultQuery={query || "SELECT image from rigs_80001_1881"}
                                    name={name || val.name}
                                />
                            </TabPanel>
                        ))
                    }
                </TabPanels>
            </Tabs>
        </>
    )

}

export default InteractiveView;


const TabView = ({defaultQuery, name}) => {
    const [refreshing, setRefreshing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [snippets, setSnippets] = useState(false);
    const [sqlValue, setSqlValue] = useState(defaultQuery);


    const { data, error, mutate, isValidating } = useSWR(
        sqlValue ? [`https://testnet.tableland.network/query?mode=json&s=${sqlValue}`] : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://testnet.tableland.network/query?mode=json&s=${sqlValue}`);
        mutate(data);
        setRefreshing(false);
    }

    async function getCode(lang, variant){
        let promise = new Promise((res, rej) => {

            codegen.convert(
                lang,
                variant,
                new sdk.Request(`https://testnet.tableland.network/query?mode=json&s=${encodeURIComponent(sqlValue)}`),
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
            if (sqlValue){
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
    },[defaultQuery, sqlValue])

    if (error) return <div>failed to load, {error}</div>;
    return (
        <chakra.div>
            <NavBar
                inputValue={sqlValue}
                setInputValue={setSqlValue}
                refresh={refresh}
                isLoading={refreshing || isValidating}
                onOpen={onOpen}
                name={name}
            />
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
            <chakra.div position="relative" height="calc(100vh - 100px)" width="100%">
                    {
                    data ? data?.message ? (
                        <Alert status='error'>
                            <AlertIcon />
                            {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                        </Alert>
                    ) : (
                        <chakra.div color="black !important" position="relative" height="calc(100vh - 100px)" width="100%">
                            <Grid data={data} downloadFilename='custom' />
                        </chakra.div>
                    ) : (
                        <Flex w="100%" h="calc(100vh - 100px)" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
            </chakra.div>
        </chakra.div>
    )
}
