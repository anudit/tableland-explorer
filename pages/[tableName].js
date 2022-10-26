import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Select, useDisclosure, Button, ButtonGroup, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useColorMode, IconButton, Tag, Tooltip, Avatar, useClipboard, Text, Alert, AlertIcon, chakra, Flex, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Grid } from "../../flat-ui/dist/index";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import { nameToAvatar, nameToSubgraph, nameToTime, parseTableData, toProperCase, freqTable } from '@/utils/stringUtils';
import Meta from '@/components/Meta';
import { FilterIcon, PlayIcon, SqlIcon, StopIcon, TablelandSmallIcon } from '@/public/icons';
import Link from 'next/link';
import { RepeatIcon, InfoOutlineIcon, LinkIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import HistoryCard from '@/components/HistoryCard';
import DetailsModal from '@/components/DetailsModal';
import { Client } from '@livepeer/webrtmp-sdk';
import LiveVideo from '@/components/LiveVideo';
import { CheckIcon } from '@chakra-ui/icons';

const TableSection = () => {

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

    // Livepeer
    const playbackId = "1f0de1rfhz6avn0g";
    const client = new Client();
    const videoDeviceRef = useRef();
    const audioDeviceRef = useRef();
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);
    const [liveSession, setLiveSession] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const { hasCopied: hasCopiedStreamLink, onCopy: onCopyStreamLink } = useClipboard(`https://lvpr.tv?v=${playbackId}`);


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

    useEffect(()=>{
        navigator.mediaDevices.enumerateDevices().then((dev)=>{
            setVideoDevices(dev.filter(e=>e?.kind == 'videoinput'));
            setAudioDevices(dev.filter(e=>e?.kind == 'audioinput'));
        })
    },[])

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${tableName}`);
        mutate(data);
        setRefreshing(false);
    }

    function refreshVideo(){
        if (liveSession){
            setShowVideo(false);
            setTimeout(()=>{
                setShowVideo(true)
            }, 2000)
        }
    }

    async function start() {

        const streamKey = '1f0d-a8xa-p6an-vtqz';
        const deviceConfig = {
            video: videoDeviceRef.current.value != '' ? {
              deviceId: videoDeviceRef.current.value
            } : true,
            audio: audioDeviceRef.current.value != '' ? {
              deviceId: audioDeviceRef.current.value
            } : true
        };
        console.log('starting with', deviceConfig)

        const stream = await navigator.mediaDevices.getUserMedia(deviceConfig);
        const session = client.cast(stream, streamKey);

        session.on('open', () => {
            setLiveSession(session);
            console.log('Stream started.');
        })

        session.on('close', () => {
          console.log('Stream stopped.');
          setLiveSession(false);
        })

        session.on('error', (err) => {
          console.log('Stream error.', err.message)
        })

    }

    function stop(){
        if(liveSession) liveSession.close()
    }

    if (error) return <div>failed to load, {error}</div>;

    let {tableId, chainId} = parseTableData(tableName);

    const url = `https://render.tableland.xyz/${chainId}/${tableId}`;

    return (
        <div>
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
                                                    return ndf;
                                                }
                                                else {
                                                    let ndf = df;
                                                    ndf.add(key);
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

            {
                liveSession && showVideo && (<LiveVideo playbackId={playbackId} title={toProperCase(tableName?.split("_").slice(0,-2).join(' '))}/>)
            }

            <Tabs w="100%" h="150px" colorScheme={colorMode === 'dark' ? 'white': 'black'}>
                <TabList direction='row' justifyContent='space-between' borderBottom='none'>
                    <Flex direction='row' w={{base:"100%", md:"33.33%"}} align='center' justifyContent='flex-start' >
                        <Link href="/">
                            <TablelandSmallIcon cursor="pointer" boxSize={6} mx={2} display='flex' />
                        </Link>
                        <Tab fontSize={{base: 'sm', md: 'md'}} >Table</Tab>
                        <Tab fontSize={{base: 'sm', md: 'md'}} >View</Tab>
                    </Flex>
                    <Flex w={{base:"100%", md:"33.33%"}} align='center' justifyContent={{base:'flex-end' ,md:'center'}}>
                        <Avatar boxSize={5} bg='whiteAlpha.500' src={nameToAvatar(tableName)} display={{base: 'none', md: 'flex'}}/>
                        <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Full Name"} placement='bottom'>
                            <Text  fontSize="sm" ml="4" fontWeight={'medium'} onClick={onCopy} cursor="pointer" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                {tableName? toProperCase(tableName?.split("_").slice(0,-2).join(' ')): ""}
                            </Text>
                        </Tooltip>
                        <Tag size='sm' mt="3px" ml={2}>#{tableId}</Tag>
                    </Flex>
                    <Flex w={{base:"fit-content", md:"33.33%"}} align='center' justifyContent='flex-end'>
                        <Tooltip hasArrow label={isValidating || refreshing ? "Refreshing Data" : "Refresh Data"} placement='left'>
                            <IconButton variant='ghost' onClick={refresh} icon={isValidating || refreshing ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isValidating || refreshing}/>
                        </Tooltip>
                    </Flex>
                </TabList>

                <TabPanels>
                    <TabPanel p={2} display='flex' direction="row" w="100%" overflowX='scroll'>
                        <MenuGroup title="Details">
                            <MenuButtonShell icon={<InfoOutlineIcon boxSize={6}/>} title="Info" onClick={onOpen}/>
                            <MenuButtonShell icon={<HamburgerIcon boxSize={6}/>} title="History" onClick={onOpenHistory}/>
                            <MenuButtonShell icon={hasCopiedLink? <CheckIcon boxSize={6}/> : <LinkIcon boxSize={6}/>} title={hasCopiedLink ? "Copied" : "Copy Link"} onClick={onCopyLink}  mr={0}/>
                        </MenuGroup>
                        <MenuGroup title="Collaborate">
                            <MenuButtonShell
                                icon={liveSession? <StopIcon color="red.300"  boxSize={6}/> : <PlayIcon color="green.300" boxSize={6}/>}
                                title={liveSession ? "Stop" : "Start"}
                                onClick={()=>{
                                    if (!liveSession) start()
                                    else stop();
                                }}
                                mr={0}
                            />
                            <Flex direction="column" h="90%" justifyContent='space-evenly'>
                                <Select placeholder='Default Video Capture' size="xs" w="180px" ref={videoDeviceRef}>
                                    {
                                        videoDevices.map((e)=>
                                            (<option value={e?.deviceId} key={e?.deviceId}>{e?.label}</option>)
                                        )
                                    }
                                </Select>
                                <Select placeholder='Default Audio Capture' size="xs" w="180px" ref={audioDeviceRef}>
                                    {
                                        audioDevices.map((e)=>
                                            (<option value={e?.deviceId} key={e?.deviceId}>{e?.label}</option>)
                                        )
                                    }
                                </Select>
                            </Flex>
                            <MenuButtonShell icon={hasCopiedStreamLink? <CheckIcon boxSize={6}/> : <LinkIcon boxSize={6}/>} title={hasCopiedStreamLink ? "Copied" : "Copy Link"} onClick={onCopyStreamLink}  mr={0}/>
                            <MenuButtonShell icon={<RepeatIcon boxSize={6} /> } title="Refresh Video" onClick={refreshVideo} />
                        </MenuGroup>
                    </TabPanel>
                    <TabPanel p={2} display='flex' direction="row">
                        <MenuGroup title="Mode">
                            <MenuButtonShell icon={<SqlIcon boxSize={6} onClick={()=>{
                                router.push(`/interactive?query=${encodeURIComponent('SELECT * from ')}${tableName}`)
                            }}/>} title="SQL Mode"/>
                            <MenuButtonShell
                                icon={colorMode== 'light' ? <MoonIcon boxSize={6} /> : <SunIcon boxSize={6} />}
                                title={colorMode== 'dark' ? "Light Mode" : "Dark Mode"}
                                onClick={toggleColorMode}
                            />
                            <MenuButtonShell
                                icon={darkGrid == false ? <MoonIcon boxSize={6} /> : <SunIcon boxSize={6} />}
                                title={darkGrid == true ? "Light Grid" : "Dark Grid"}
                                onClick={()=>{
                                    setDarkGrid(e=>!e);
                                }}
                                mr={0}
                            />
                        </MenuGroup>
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
                        <chakra.div color="black !important" position="relative" height="calc(100vh - 150px)" width="100%" filter={darkGrid ? 'invert(1)' : 'none'} transition="all 0.3s ease-in">
                            <Grid data={data} downloadFilename={tableName} />
                        </chakra.div>
                    ) : (
                        <Flex w="100%" h="calc(100vh - 150px)" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
            </chakra.div>
        </div>
    )

}

export default TableSection;


const MenuButtonShell = ({icon, title, ...props}) => {

    return (
        <Flex
            my={1}
            direction="column"
            minWidth='70px'
            height='60px'
            alignItems='center'
            justifyContent='space-evenly'
            cursor='pointer'
            borderRadius={6}
            _hover={{
                background: 'hsl(0deg 0% 50% / 20%)'
            }}
            {...props}
        >
            {icon}
            <Text fontWeight='light' fontSize='xs'>{title}</Text>
        </Flex>
    )
}


const MenuGroup = ({title, children, ...props}) => {
    const { colorMode } = useColorMode();
    return (
        <chakra.fieldset
            borderWidth="1px"
            borderRadius={6}
            borderColor="hsl(0deg 0% 50% / 50%)"
            justifyContent='center'
            display='flex'
            mr={2}
            px={1}
            {...props}
        >
            <chakra.legend
                ml={2}
                color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}
            >
                {title}
            </chakra.legend>
            <Flex direction='row'>
                {children}
            </Flex>
        </chakra.fieldset>
    )
}
