import { Button, ButtonGroup, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Switch, Text, VStack, useColorMode, useDisclosure } from "@chakra-ui/react";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { EraserIcon, PlusIcon, TerminalIcon, WalletIcon } from "@/public/icons";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
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
    const [tableName, setTableName] = useState('New Table');
    const [sql, setSql] = useState('');
    const chainId = useChainId();

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

    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const { colorMode } = useColorMode();
    const { openConnectModal } = useConnectModal();
    const addRecentTransaction = useAddRecentTransaction();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const run = async () => {
        const db = new Database({signer});
        const { meta, name } = await db
                .prepare(sql)
                .run();

        addRecentTransaction({
            hash: meta.txn.transactionHash,
            description: `Create Table ${name}`,
        });

        await meta.txn.wait();

        

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
                        <Flex mt='10px' w={{base: "100%", md: "80%"}} direction="column" p={2}>
                            <InputGroup size='sm' >
                                <InputLeftAddon>Table Name</InputLeftAddon>
                                <Input placeholder="Table Name" defaultValue='New Table' maxW="300px" onChange={(e)=>{
                                    setTableName(e.currentTarget.value);
                                }} mb={2}/>
                                <InputRightAddon>
                                    _{chainId}
                                </InputRightAddon>
                            </InputGroup>


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
                                </ModalBody>
                                </ModalContent>
                            </Modal>
                            <Flex mt={2}>
                                <ButtonGroup size="lg" isAttached>
                                    <IconButton icon={<EraserIcon/>} onClick={eraseTable}>Reset Columns</IconButton>
                                    <IconButton icon={<TerminalIcon/>} onClick={onOpen}>Preview SQL</IconButton>
                                    <Button leftIcon={<CheckCircleIcon/>} onClick={run}>Create Table</Button>
                                </ButtonGroup>
                            </Flex>
                        </Flex>
                    )
                }
            </Flex> 
        </PageShell>
    )

}
