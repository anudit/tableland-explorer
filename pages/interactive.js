import React, { useEffect, useState } from 'react';
import useSWR from "swr";
import { Grid } from "@anudit/flat-ui";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { List, ListItem, chakra, Flex, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Text, Textarea, useColorMode } from '@chakra-ui/react';
import { CloseIcon, SmallAddIcon, SettingsIcon, WarningTwoIcon } from "@chakra-ui/icons";
import sdk from 'postman-collection';
import Split from 'react-split';
const codegen = require('postman-code-generators')

import Meta from '@/components/Meta';
import InteractiveEditor from '@/components/interactive/InteractiveEditor';
import { ActionBar } from "@/components/interactive/ActionBar";
import fetcher from '@/utils/fetcher';
import { TablelandSmallIcon, TerminalIcon } from '@/public/icons';
import { Parser } from 'node-sql-parser';
import { isMainnetTable } from '@/utils/stringUtils';

const InteractiveView = () => {

    const router = useRouter();
    const { query, name } = router.query;
    const [loaded, setLoaded] = useState(false);
    const [tabsData, setTabsData] = useState([]);
    const { colorMode } = useColorMode();

    useEffect(()=>{
        if(query && !loaded){
            setTabsData((oldData)=>{
                let newData = [].concat(oldData);
                let newId = Math.max(...oldData.map(e=>e?.id))+1;
                if (isFinite(newId) == false) newId = 0;
                newData.push({name: name || `Query ${newId}`, id: newId, defaultQuery: query});
                return newData;
            })
            console.log('set with query', query)
            setLoaded(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[query])

    useEffect(()=>{
        console.log('tabs now', tabsData);
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
            <Tabs defaultIndex={0} variant='soft-rounded' w="100%" h="100vh" colorScheme='whiteAlpha'>
                <TabList display='flex' alignItems='center' direction="row" w="100%" overflowX='auto' h="50px" borderBottom='none'>
                    <Link href="/">
                        <TablelandSmallIcon cursor="pointer" boxSize={6} mx={3}/>
                    </Link>
                    {
                        tabsData.map((val)=>
                            <Tab
                                key={val.id}
                                _selected={{
                                    color: colorMode === 'dark'? 'white': 'black',
                                    borderBottom: '1px'
                                }}
                                borderBottomRadius='0'
                            >
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
                                    defaultQuery={val?.defaultQuery || "SELECT image from rigs_80001_1881"}
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

const isMainnetTableFromQuery = (query) => {
    try {
        const parser = new Parser();
        const ast = parser.astify(query);
        return isMainnetTable(ast.from[0].table);
    } catch (error) {
        return false;
    }
}

const TabView = ({defaultQuery, name}) => {
    const [refreshing, setRefreshing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [snippets, setSnippets] = useState(false);
    const [sqlValue, setSqlValue] = useState(defaultQuery);
    const [sqlError, setSqlError] = useState(false);
    const { colorMode } = useColorMode();

    const { data, error, mutate, isValidating } = useSWR(
        sqlValue ? [`https://${isMainnetTableFromQuery(sqlValue) ? '' : 'testnets.'}tableland.network/api/v1/query?statement=?mode=json&s=${sqlValue}`] : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://${isMainnetTableFromQuery(sqlValue) ? '' : 'testnets.'}tableland.network/api/v1/query?statement=?mode=json&s=${sqlValue}`);
        mutate(data);
        setRefreshing(false);
    }

    async function getCode(lang, variant){
        let promise = new Promise((res, rej) => {

            codegen.convert(
                lang,
                variant,
                new sdk.Request(`https://${isMainnetTableFromQuery(sqlValue) ? '' : 'testnets.'}tableland.network/api/v1/query?statement=?mode=json&s=${encodeURIComponent(sqlValue)}`),
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
        <Split className="split" direction='vertical' style={{
            flexDirection: 'column'
        }} sizes={[25, 75]} minSize={200}>
            <InteractiveEditor
                inputValue={sqlValue}
                setInputValue={setSqlValue}
                refresh={refresh}
                isLoading={refreshing || isValidating}
                sqlError={sqlError}
                setSqlError={setSqlError}
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
            <chakra.div position="relative" width="100%">
                {
                    data ? data?.message ? (
                        <Flex alignItems='center' justifyContent="center" width="100%" h="100%">
                            <Flex direction="row" justifyContent="space-evenly" alignItems="center" w={{base: "100%", md:"340px"}} borderRadius={1} py={4} px={8}
                                background={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
                                _hover={{
                                    'background': colorMode === 'light' ? 'gray.300' : 'whiteAlpha.200'
                                }}
                            >
                                <Flex direction='column'>
                                    <WarningTwoIcon boxSize={10} mr={4} color={colorMode === 'light' ? 'red.500' : 'red.300'}/>
                                    <Text fontWeight={600} color={colorMode === 'light' ? 'red.500' : 'red.300'}>Error</Text>
                                </Flex>
                                <List spacing={0}>
                                    {
                                        data?.message === 'Row not found' ? (
                                            <>
                                                <ListItem key={0}> <SettingsIcon mr={2} mb={1}/>{data?.message}</ListItem>
                                                <ListItem key={1}> <SettingsIcon mr={2} mb={1}/>Table is Empty</ListItem>
                                            </>
                                        ) :
                                        data?.message.split(': ').map((val, ind)=>(
                                            <ListItem key={ind}>
                                                <SettingsIcon mr={2} mb='2px' />{val}
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Flex>
                        </Flex>
                    ) : (
                        <chakra.div color="black !important" position="relative" width="100%" h="95%">
                            <Grid data={data} downloadFilename='custom' />
                        </chakra.div>
                    ) : (
                        <Flex w="100%" h="100%" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
                <ActionBar
                    inputValue={sqlValue}
                    sqlError={sqlError}
                    isLoading={refreshing || isValidating}
                    refresh={refresh}
                    onOpen={onOpen}
                />
            </chakra.div>
        </Split>
    )
}
