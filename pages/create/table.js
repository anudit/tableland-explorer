import { Tooltip, Code, useToast, Button, ButtonGroup, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Switch, Text, VStack, useColorMode, useDisclosure, Textarea } from "@chakra-ui/react";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { EraserIcon, ImportIcon, OpenaiIcon, PlusIcon, TerminalIcon, WalletIcon } from "@/public/icons";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction, useConnectModal } from "@rainbow-me/rainbowkit";

import { Database } from "@tableland/sdk";
import PageShell from "@/components/PageShell";
import {
    SimpleGrid
} from '@chakra-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { format } from "sql-formatter";
import { useChainId } from "wagmi";
import Link from "next/link";
import Image from "next/image";

export default function CreateTable() {

    const columnTypes = {
        TEXT: 'TEXT',
        INTEGER: 'INTEGER',
    };
    const emptyRow = {
        name: '',
        type: columnTypes.INTEGER,
        isNotNull: false,
        isPrimaryKey: false,
        isUnique: false,
        defaultValue: '',
    }
    const [tableDetails, setTableDetails] = useState([emptyRow]);
    const [tableName, setTableName] = useState('Tablescan');
    const [isCreatingTable, setIsCreatingTable] = useState(false);
    const [newTableName, setNewTableName] = useState('');
    const [sql, setSql] = useState('');
    const chainId = useChainId();
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const { colorMode } = useColorMode();
    const { openConnectModal } = useConnectModal();
    const addRecentTransaction = useAddRecentTransaction();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenTC, onOpen: onOpenTC, onClose: onCloseTC } = useDisclosure();

    const importDataRef = useRef(null);
    const { isOpen: isOpenImport, onOpen: onOpenImport, onClose: onCloseImport } = useDisclosure();

    const toast = useToast()

    function updateTableDetails(colInd, key, value){
        setTableDetails((currTableDetails)=>{
            let newTableDetails = structuredClone(currTableDetails);
            newTableDetails[colInd][key] = value;
            return newTableDetails
        })
    }

    function addTableColumn(){
        if (tableDetails.length < 24) {
            setTableDetails((currTableDetails)=>{
                let newTableDetails = structuredClone(currTableDetails);
                newTableDetails.push(emptyRow)
                return newTableDetails
            })
        }
        else {
            alert('Tableland Network has a limit of 24 Table Columns')
        }
    }
    function removeTableColumn(rowInd){
        setTableDetails((currTableDetails)=>{
            let sec1 = currTableDetails.slice(0, rowInd);
            let sec2 = currTableDetails.slice(rowInd+1);
            console.log({rowInd, currTableDetails, sec1, sec2})
            return sec1.concat(sec2);
        })
    }
    function eraseColumn(rowInd){
        setTableDetails((currTableDetails)=>{
            let dets = structuredClone(currTableDetails)
            dets[rowInd] = emptyRow;
            return dets
        })
    }
    function eraseTable(){
        setTableDetails([emptyRow])
    }

    function importColumns(){
        let data = JSON.parse(importDataRef.current.value);
        let obj = false;
        if (data.length > 0 && Object.keys(data[0]).length > 0 ){
            obj = data[0]
        }
        else if (Object.keys(data).length > 0) {
            obj = data;
        }

        let newSchema = [];
        let keys = Object.keys(obj).slice(0, 24);
        if (obj){
            for (let index = 0; index < keys.length; index++) {
                const value = obj[keys[index]];
                let row = structuredClone(emptyRow);
                row.name = keys[index]
                
                if (Number.isInteger(value)) row.type = columnTypes.INTEGER;
                else row.type = columnTypes.TEXT;

                newSchema.push(row);
            }
        }
        setTableDetails(newSchema);
    }

    

    const run = async () => {

        setIsCreatingTable(true);

        try {
            const db = new Database({signer});
            const { meta } = await db
                    .prepare(sql)
                    .run();

            const name = meta.txn.prefix + '_' + meta.txn.tableId ;
            console.log(meta)

            setNewTableName(name);
    
            addRecentTransaction({
                hash: meta.txn.transactionHash,
                description: `Create Table ${name}`,
            });
    
            await meta.txn.wait();

            onOpenTC();

            
        } catch (error) {
            console.log(error);
            if (error?.message.includes('user rejected transaction')){
                toast({
                    title: 'Oops!',
                    description: 'Transaction Rejected by the user',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                })
            }
            else {
                toast({
                    title: 'Oops!',
                    description: error?.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                })
            }
        }


        setIsCreatingTable(false);
        

    }

    useEffect(()=>{
        let finalSql = `CREATE TABLE ${tableName.trim().replaceAll(' ', '_')}_${chainId} (
            ${tableDetails
                .filter(td=>td.name.trim()!="")
                .map(td=>`
                    ${td.name} 
                    ${td.type} 
                    ${td.isPrimaryKey ? 'PRIMARY KEY': ''} 
                    ${td.isNotNull ? 'NOT NULL': ''} 
                    ${td.isUnique ? 'UNIQUE': ''}
                    ${td.defaultValue.trim() != "" ? `DEFAULT '${td.defaultValue}'` : ''} 
                `)
            }
        );`
        setSql(finalSql);
        // console.log('finalSql', finalSql);
    },[tableDetails, tableName, chainId])

    return (
        <PageShell title="Create Table | Tablescan.io" searchProps={{customTitle: "Create Table"}}>
            <Flex w="100%" direction="column" mt="70px" alignItems="center" minH="100vh">
                {
                    !isConnected ? (
                        <Flex mt='20px' w={{base: "100%", md: "70%"}} alignItems='center' direction="column" p={2}>
                            <Heading>Let&apos;s start by Connecting your Wallet</Heading>
                            <Button rightIcon={<WalletIcon/>} mt={2} onClick={openConnectModal}>Connect Wallet</Button>  
                        </Flex>
                    ) : (
                        <Flex mt='10px' w={{base: "100%", xl: "80%"}} direction="column" p={2}>
                            <Flex direction={{base: "column", md: "row"}}>
                                <InputGroup size='lg' >
                                    <InputLeftAddon borderLeftRadius='30px'>Table Name</InputLeftAddon>
                                    <Input placeholder="Table Name" defaultValue='Tablescan' maxW="300px" onChange={(e)=>{
                                        setTableName(e.currentTarget.value);
                                    }} mb={2}/>
                                    <InputRightAddon borderRightRadius='30px'>
                                        _{chainId}
                                    </InputRightAddon>
                                </InputGroup>
                                <Flex direction="row" justifyContent={{base: "center", md:"flex-start"}}>
                                    <ButtonGroup size="lg" isAttached>
                                        <Tooltip label='Use ChatGPT to describe Schema' hasArrow placement='left'>
                                            <IconButton icon={<OpenaiIcon/>} disabled={true}/>
                                        </Tooltip>
                                        <Tooltip label='Data to Schema' hasArrow placement='left'>
                                            <IconButton icon={<ImportIcon/>} onClick={onOpenImport}/>
                                        </Tooltip>
                                        <Tooltip label='Preview SQL' hasArrow placement='left'>
                                            <IconButton icon={<TerminalIcon/>} onClick={onOpen}/>
                                        </Tooltip>
                                        <Tooltip label='Reset Schema' hasArrow placement='left'>
                                            <IconButton icon={<EraserIcon/>} onClick={eraseTable}/>
                                        </Tooltip>
                                        <Tooltip label='Create Table' hasArrow placement='left'>
                                            <IconButton icon={<CheckCircleIcon/>} onClick={run} isLoading={isCreatingTable}/>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Flex>
                            </Flex>


                            <SimpleGrid columns={{base: 1, sm: 1, md: 2, lg: 3, xl: 4}} spacing={4} justifyContent="center" my={4}>
                                        {
                                            tableDetails.map((tableDetail, colInd)=>{
                                                return (
                                                    <Flex 
                                                        key={colInd}
                                                        w={{base: "100%", md:"300px"}} 
                                                        direction="column"
                                                        borderRadius='10px'
                                                        borderWidth="1px" 
                                                        borderColor={colorMode === 'light' ? '#0000001a' : '#ffffff1a'}
                                                        p={6}
                                                        background={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
                                                        _hover={{
                                                            'background': colorMode === 'light' ? 'gray.300' : 'whiteAlpha.200'
                                                        }}
                                                    >
                                                        <VStack key={colInd}>
                                                                <Input placeholder="Column Name" minWidth='100px' value={tableDetail.name} onChange={(e)=>{
                                                                    updateTableDetails(colInd, 'name', e.currentTarget.value.replace(' ', '_'))
                                                                }}/>
                                                                <InputGroup size="sm">
                                                                    <InputLeftAddon>Type</InputLeftAddon>
                                                                    <Select minWidth='70px' value={tableDetail.type} onChange={(e)=>{
                                                                        updateTableDetails(colInd, 'type', e.currentTarget.value)
                                                                    }}
                                                                        borderLeftRadius="0"
                                                                    >
                                                                        <option value={columnTypes.INTEGER}>{columnTypes.INTEGER}</option>
                                                                        <option value={columnTypes.TEXT}>{columnTypes.TEXT}</option>
                                                                    </Select>
                                                                </InputGroup>
                                                                <FormControl justifyContent='center' >

                                                                    <Flex direction="row" justifyContent='space-between'>
                                                                        <FormLabel htmlFor={`isNotNull_${colInd}`}>Not Null</FormLabel>
                                                                        <Switch id={`isNotNull_${colInd}`} value={tableDetail.isNotNull} onChange={(e)=>{
                                                                            updateTableDetails(colInd, 'isNotNull', e.currentTarget.checked)
                                                                        }}/>
                                                                    </Flex>
                                                                    
                                                                    <Flex direction="row" justifyContent='space-between'>
                                                                        <FormLabel htmlFor={`isPrimaryKey_${colInd}`}>Primary Key</FormLabel>
                                                                        <Switch id={`isPrimaryKey_${colInd}`} value={tableDetail.isPrimaryKey} onChange={(e)=>{
                                                                            updateTableDetails(colInd, 'isPrimaryKey', e.currentTarget.checked)
                                                                        }}/>
                                                                    </Flex>

                                                                    <Flex direction="row" justifyContent='space-between'>
                                                                        <FormLabel htmlFor={`isUnique_${colInd}`}>Unique</FormLabel>
                                                                        <Switch id={`isUnique_${colInd}`} value={tableDetail.isUnique} onChange={(e)=>{
                                                                            updateTableDetails(colInd, 'isUnique', e.currentTarget.checked)
                                                                        }}/>
                                                                    </Flex>
                                                                </FormControl>
                                                                <Input placeholder="Default Value" minWidth='100px' value={tableDetail.defaultValue} onChange={(e)=>{
                                                                    updateTableDetails(colInd, 'defaultValue', e.currentTarget.value)
                                                                }}/>
                                                                <ButtonGroup isAttached>
                                                                    <IconButton title="Erase Details" variant='ghost' icon={<EraserIcon onClick={()=>{
                                                                        eraseColumn(colInd)
                                                                    }}/>} />
                                                                    <IconButton title="Remove Row" variant='ghost' icon={<DeleteIcon onClick={()=>{
                                                                        removeTableColumn(colInd)
                                                                    }}/>} />
                                                                </ButtonGroup>
                                                        </VStack>
                                                    </Flex>
                                                    
                                                )
                                            })
                                        }
                                        <Flex 
                                            key="add"
                                            w={{base: "100%", md:"300px"}} 
                                            direction="column"
                                            borderRadius='10px'
                                            borderWidth="1px" 
                                            borderColor={colorMode === 'light' ? '#0000001a' : '#ffffff1a'}
                                            p={6}
                                            alignItems="center"
                                            justifyContent="center"
                                            background={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
                                            _hover={{
                                                'background': colorMode === 'light' ? 'gray.300' : 'whiteAlpha.200'
                                            }}
                                            onClick={addTableColumn}
                                            cursor="pointer"
                                        >
                                            <PlusIcon/>
                                            <Text mt={2}>Add Column</Text>
                                        </Flex>
                            </SimpleGrid>

                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Preview SQL</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <SyntaxHighlighter language="sql" style={atomOneDark} wrapLongLines={true} wrapLines={true} customStyle={{
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        width: '95%'
                                    }}>
                                        {format(sql || "", { language: 'mysql'})}
                                    </SyntaxHighlighter>
                                    <br/>
                                </ModalBody>
                                </ModalContent>
                            </Modal>
                            <Modal isOpen={isOpenTC} onClose={onCloseTC} size="sm">
                                <ModalOverlay backdropFilter='blur(10px)' />
                                <ModalContent>
                                <ModalHeader>🥳 Table Created</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody display='flex' justifyContent='center' alignItems='center' flexDirection="column">
                                    <Text>Your freshly minted table <Code>{newTableName}</Code> is all ready</Text>
                                    <br/>
                                    <Image alt="success" src="https://media0.giphy.com/media/S9iMXx6Lqrr5mJoMxC/giphy.gif?cid=ecf05e47mbp2vqfbda6f8njv814szlwki61r3ydlyvudal6s&rid=giphy.gif&ct=g" height={300} width={300}/>
                                </ModalBody>
                                <ModalFooter>
                                    <Link href={`/${newTableName}`}>
                                        <Button>Explore Table</Button>
                                    </Link>
                                </ModalFooter>
                                </ModalContent>
                            </Modal>
                            <Modal isOpen={isOpenImport} onClose={onCloseImport} size="sm">
                                <ModalOverlay backdropFilter='blur(10px)' />
                                <ModalContent>
                                <ModalHeader><ImportIcon boxSize={4} mr={2}/> Import Schema</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody display='flex' justifyContent='center' alignItems='center' flexDirection="column">
                                    <Text>Enter a sample JSON Object representing your data and we will automatically convert it into it&apos;s schema.</Text>
                                    <br/>
                                    <Textarea ref={importDataRef} noOfLines={10} minH="200px"/>
                                    <br/>
                                    <Alert status='warning'>
                                        <AlertIcon />
                                        <AlertDescription>This will reset your existing changes.</AlertDescription>
                                    </Alert>
                                </ModalBody>
                                <ModalFooter display='flex' flexDirection='row' justifyContent='space-between'>
                                    <Button variant='ghost' onClick={()=>{
                                        importDataRef.current.value = `{"id": 49863, "url": "https://yts.mx/movies/caught-out-crime-corruption-cricket-2023", "imdb_code": "tt27055390", "title": "Caught Out: Crime. Corruption. Cricket", "title_english": "Caught Out: Crime. Corruption. Cricket", "title_long": "Caught Out: Crime. Corruption. Cricket (2023)", "slug": "caught-out-crime-corruption-cricket-2023", "year": 2023, "rating": 0, "runtime": 0, "genres": ["Documentary", "Sport"], "summary": "India's biggest match-fixing scandal, the icons caught in its web and the journalists who uncovered the corruption.", "description_full": "India's biggest match-fixing scandal, the icons caught in its web and the journalists who uncovered the corruption.", "synopsis": "India's biggest match-fixing scandal, the icons caught in its web and the journalists who uncovered the corruption.", "yt_trailer_code": "ZT2P__EQqUE", "language": "en", "mpa_rating": "", "background_image": "https://yts.mx/assets/images/movies/caught_out_crime_corruption_cricket_2023/background.jpg", "background_image_original": "https://yts.mx/assets/images/movies/caught_out_crime_corruption_cricket_2023/background.jpg", "small_cover_image": "https://yts.mx/assets/images/movies/caught_out_crime_corruption_cricket_2023/small-cover.jpg", "medium_cover_image": "https://yts.mx/assets/images/movies/caught_out_crime_corruption_cricket_2023/medium-cover.jpg", "large_cover_image": "https://yts.mx/assets/images/movies/caught_out_crime_corruption_cricket_2023/large-cover.jpg", "state": "ok", "date_uploaded": "2023-03-17 09:43:52", "date_uploaded_unix": 1679042632}`
                                    }}>Example</Button>
                                    <Button onClick={()=>{
                                        importColumns()
                                        onCloseImport()
                                    }}>Convert to Schema</Button>
                                </ModalFooter>
                                </ModalContent>
                            </Modal>
                            <Flex mt={2}>
                                <Button size="lg" ml={2} leftIcon={<CheckCircleIcon/>} onClick={run} isLoading={isCreatingTable}>Create Table</Button>
                            </Flex>
                        </Flex>
                    )
                }
            </Flex> 
        </PageShell>
    )

}
