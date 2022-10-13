import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDisclosure, Button, ButtonGroup, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useColorMode, IconButton, Tag, Tooltip, Avatar, useClipboard, Text, Alert, AlertIcon, chakra, Flex, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Grid } from "@githubocto/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import { nameToAvatar, nameToSubgraph, nameToTime, parseTableData, toProperCase, freqTable } from '@/utils/stringUtils';
import Meta from '@/components/Meta';
import { FilterIcon, SqlIcon, TablelandSmallIcon } from '@/public/icons';
import Link from 'next/link';
import { RepeatIcon, InfoOutlineIcon, LinkIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import HistoryCard from '@/components/HistoryCard';
import DetailsModal from '@/components/DetailsModal';

const IdentitySection = () => {

    const router = useRouter();
    const { tableName } = router.query;
    const { hasCopied, onCopy } = useClipboard(tableName);
    const [refreshing, setRefreshing] = useState(false);
    const [tableMetadata, setTableMetadata] = useState(false);
    const [darkGrid, setDarkGrid] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard("https://tablescan.vercel.app/"+tableName);
    const { isOpen: isOpenHistory, onOpen: onOpenHistory, onClose: onCloseHistory } = useDisclosure();
    const [disabledFilter, setDisabledFilter] = useState(new Set([]));

    const { data, error, mutate, isValidating } = useSWR(
        tableName ? [`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`] : null,
        fetcher,
        { refreshInterval: tableName? nameToTime(tableName) : 10000, revalidateOnFocus: true }
    );

    useEffect(()=>{
        async function run(){
            if (tableName){
                let subgraph = nameToSubgraph(tableName);
                if (subgraph){
                    let data = await fetcher(subgraph, "POST", {
                        query: `
                            query {
                                tables(where: {name: "${tableName}"}, first: 1) {
                                    id
                                    name
                                    owner {
                                        id
                                    }
                                    tableId
                                    statement
                                    tokenURI
                                    created
                                    txnHash
                                    controller {
                                        id
                                    }
                                    historyCount
                                    history {
                                        id
                                        statement
                                        time
                                    }
                                }
                            }
                        `
                    })
                    setTableMetadata(data?.data?.tables[0]);
                }
            }
        }
        run();
    },[tableName])

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`);
        mutate(data);
        setRefreshing(false);
    }

    if (error) return <div>failed to load, {error}</div>;

    let {tableId, chainId} = parseTableData(tableName);

    const url = `https://render.tableland.xyz/${chainId}/${tableId}`;

    return (
        <>
            <Meta url={url} />

            <Drawer
                isOpen={isOpenHistory}
                placement='right'
                onClose={onCloseHistory}
                size='md'
                >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton mt="7px"/>
                <DrawerHeader>History</DrawerHeader>

                <DrawerBody>
                    <Flex w="100%" justifyContent='center' alignItems='center'>
                    <FilterIcon mr={2}/>
                    {
                        tableMetadata && tableMetadata?.history && (
                        <ButtonGroup size='sm' isAttached >
                            {
                            Object.entries(freqTable(tableMetadata?.history.map(e=>e.statement?.split(' ')[0].toUpperCase()))).map(([key, val])=>(
                                <Button
                                key={key}
                                colorScheme={disabledFilter.has(key) ? 'gray': null}
                                variant={disabledFilter.has(key) ? 'ghost': 'solid'}
                                onClick={()=>{
                                    setDisabledFilter(df=>{
                                    if (df.has(key)) {
                                        let ndf =  df;
                                        ndf.delete(key)
                                        console.log('setting', ndf)
                                        return ndf;
                                    }
                                    else {
                                        let ndf = df;
                                        ndf.add(key);
                                        console.log('setting', ndf)
                                        return ndf;
                                    }
                                    })
                                }}
                                >
                                {key}
                                <Tag ml={2} size='sm'>{val}</Tag>
                                </Button>
                            ))
                            }
                        </ButtonGroup>
                        )
                    }
                    </Flex>
                    <br/>
                    {
                    tableMetadata && tableMetadata?.history?.sort(function(a, b){return parseInt(b.time) - parseInt(a.time)}).map(hist=>(
                        <HistoryCard
                            tableName={tableName}
                            hist={hist}
                            display={disabledFilter.has(hist?.statement?.split(' ')[0].toUpperCase()) ? 'none' : 'flex'}
                            key={hist.id}
                        />
                    ))
                    }
                </DrawerBody>
                </DrawerContent>
            </Drawer>

            <DetailsModal tableMetadata={tableMetadata} onClose={onClose} isOpen={isOpen}/>

            <Tabs w="100%" h="150px" colorScheme={colorMode === 'dark' ? 'white': 'black'}>
                <TabList direction='row' justifyContent='space-between' borderBottom='none'>
                    <Flex direction='row' w={{base:"100%", md:"33.33%"}} align='center' justifyContent='flex-start' >
                        <Link href="/">
                            <TablelandSmallIcon cursor="pointer" boxSize={6} mx={2} display={{base: 'none', md: 'flex'}}/>
                        </Link>
                        <Tab fontSize={{base: 'sm', md: 'md'}} >Table</Tab>
                        <Tab fontSize={{base: 'sm', md: 'md'}} >View</Tab>
                    </Flex>
                    <Flex w={{base:"100%", md:"33.33%"}} align='center' justifyContent='center'>
                        <Avatar boxSize={5} bg='whiteAlpha.500' src={nameToAvatar(tableName)} />
                        <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Full Name"} placement='bottom'>
                            <Text  fontSize="sm" ml="4" fontWeight={'medium'} onClick={onCopy} cursor="pointer" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                {tableName? toProperCase(tableName?.split("_").slice(0,-2).join(' ')): ""}
                            </Text>
                        </Tooltip>
                        <Tag size='sm' mt="3px" ml={2}>#{tableId}</Tag>
                    </Flex>
                    <Flex w={{base:"100%", md:"33.33%"}} align='center' justifyContent='flex-end'>
                        <Tooltip hasArrow label={isValidating || refreshing ? "Refreshing Data" : "Refresh Data"} placement='left'>
                            <IconButton variant='ghost' onClick={refresh} icon={isValidating || refreshing ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isValidating || refreshing}/>
                        </Tooltip>
                    </Flex>
                </TabList>

                <TabPanels>
                    <TabPanel p={2} display='flex' direction="row" w="100%" overflowX='scroll'>
                        <MenuButtonShell icon={<InfoOutlineIcon boxSize={8}/>} title="Info" onClick={onOpen}/>
                        <MenuButtonShell icon={<LinkIcon boxSize={8}/>} title={hasCopiedLink ? "Copied" : "Copy Link"} onClick={onCopyLink} />
                        <MenuButtonShell icon={<HamburgerIcon boxSize={8}/>} title="History" onClick={onOpenHistory}/>
                    </TabPanel>
                    <TabPanel p={2} display='flex' direction="row">
                        <MenuButtonShell icon={<SqlIcon boxSize={8} onClick={()=>{
                            router.push(`/interactive?query=${encodeURIComponent('SELECT * from ')}${tableName}`)
                        }}/>} title="SQL Mode"/>
                        <MenuButtonShell
                            icon={colorMode== 'light' ? <MoonIcon boxSize={8} /> : <SunIcon boxSize={8} />}
                            title={colorMode== 'dark' ? "Light Mode" : "Dark Mode"}
                            onClick={toggleColorMode}
                        />
                        <MenuButtonShell
                            icon={darkGrid == false ? <MoonIcon boxSize={8} /> : <SunIcon boxSize={8} />}
                            title={darkGrid == true ? "Light Grid" : "Dark Grid"}
                            onClick={()=>{
                                setDarkGrid(e=>!e);
                            }}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <chakra.div position="relative" height="calc(100vh - 150px)" width="100%">
                {
                    data ? data?.message ? (
                        <Alert status='error'>
                            <AlertIcon />
                            {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                        </Alert>
                    ) : (
                        <chakra.div color="black !important" position="relative" height="calc(100vh - 150px)" width="100%" filter={darkGrid ? 'invert(1)' : 'none'}>
                            <Grid data={data} downloadFilename={tableName} />
                        </chakra.div>
                    ) : (
                        <Flex w="100%" h="calc(100vh - 150px)" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
            </chakra.div>
        </>
    )

}

export default IdentitySection;


const MenuButtonShell = ({icon, title, ...props}) => {

    return (
        <Flex
            mr={2}
            direction="column"
            minWidth='70px'
            height='90px'
            alignItems='center'
            justifyContent='space-evenly'
            cursor='pointer'
            {...props}
        >
            {icon}
            <Text fontWeight='light' fontSize='sm'>{title}</Text>
        </Flex>
    )
}
