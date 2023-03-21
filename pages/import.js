import React, { useEffect, useState } from "react";
import { ButtonGroup, useClipboard, Input, Heading, Button, useColorMode, Flex, Text } from "@chakra-ui/react";

import { networkDeets, parseTableData, stringSize } from "@/utils/stringUtils";
import Dropzone from 'react-dropzone';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { RepeatIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useSigner } from "wagmi";
import { Database } from "@tableland/sdk";
import init from "@tableland/sqlparser";
import PageShell from "@/components/PageShell";
import { format } from "sql-formatter";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

const getSize = (st) => { 
    let size = new Blob([st]).size;
    return size;
}

const formatForSql = (typeName, value) => {
    if (typeName.toUpperCase() == 'INTEGER') {
        return parseInt(value)
    }
    else {
        return `'${value.toString().replaceAll("'", "''").trim().slice(0, 1000)}'`
    }
}

export default function DiscoverPage() {

    const [columns, setColumns] = useState([]);
    const [chonks, setChonks] = useState([]);
    const [stats, setStats] = useState(false);
    const [tname, setTname] = useState(false);
    const [fileData, setFileData] = useState(false);
    const [parserLoaded, setParserLoaded] = useState(false);

    const [loading, setLoading] = useState(false);
    // const { data: signer } = useSigner();

    function getCreateStatement(name, schema){
        let createStatement  = `CREATE TABLE ${name} (${Object.entries(schema).map(([cname, ctype])=>`${cname} ${ctype}`).toString()});`;
        return createStatement;
    }

    function convertJsonToChonks(name, schema, completeData){

        let {chainId} = parseTableData(name);
        let maxChonkSizeInKb = networkDeets[chainId].chonkLimit;

        let allStatements = [];
        let currentStatement = null;
        let currentIndex = 0;
    
        while (currentIndex < completeData.length) { 
            
            if (currentStatement === null){
                currentStatement = `INSERT INTO ${name} VALUES `
            }
    
            let staged = Object
                            .entries(completeData[currentIndex])
                            .filter(e=>{
                                return Object.keys(schema).includes(e[0])
                            })
                            .map(([cname, cval])=>`${formatForSql( schema[cname], cval)}`).toString()
            
            staged = '('+staged+'),';
            
            let stageSize = getSize(currentStatement + staged + ';');
    
            if (stageSize <= maxChonkSizeInKb*1000){
                currentStatement += staged;
            }
            else {
                currentStatement= currentStatement.slice(0, currentStatement.length-1) + ';';

                allStatements.push(currentStatement); 

                currentStatement = null;
            }
    
            currentIndex++;
        }

        currentStatement= currentStatement.slice(0, currentStatement.length-1) + ';';
        allStatements.push(currentStatement); 

        return allStatements;  

    }

    const clear = () => {
        setColumns({}) 
        setChonks([])
        setTname(false);
        setFileData(false);
        setStats(false)
        setLoading(false)
    }

    const onDrop = (files) => {
        setLoading(true);
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                let fname = files[0].name.split('.')[0].replaceAll('-', '_');
                setTname(fname);

                let data = JSON.parse(e.target.result);
                setFileData(data);

                let cols = Object.keys(data[0]);
                let colsParsed = {};
                for (let index = 0; index < Math.min(cols.length, 24); index++) {
                    const element = data[0][cols[index]];
                    if (typeof element === 'number' && Number.isInteger(element)) {
                        colsParsed[cols[index]] = 'integer';
                    }
                    else {
                        colsParsed[cols[index]] = 'text';
                    }
                }
                console.log('colsParsed', colsParsed);
                setColumns(colsParsed);

                
                setStats({
                    fileSize: e.target.size,
                    rows: data.length,
                    columns: Object.keys(colsParsed).length
                })

                setLoading(false)
            } catch (error) {
                alert(error)
                clear();
            }
            
        };
        reader.readAsText(files[0]);
    };

    useEffect(()=>{
        init().then(()=>{
            console.log('SQL parser loaded');
            setParserLoaded(true);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if (parserLoaded === true && tname != false && Boolean(global.sqlparser) === true && Boolean(global.sqlparser?.validateTableName) === true){

            try {
                global.sqlparser.validateTableName(tname).then((resp) =>{
                    console.log('validatedTableName', resp);
                    if (resp.chainId) setChonks(convertJsonToChonks(tname, columns, fileData))
                })
                
            } catch (error) {
                console.log('validateTableName', error)
            }

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tname, parserLoaded])

    return (
        <PageShell title="Import Data | Tablescan.io" searchProps={{customTitle: "Import Data"}}>
            <Flex w="100%" direction="column" mt="70px" alignItems="center" minH="100vh">
                <Flex mt='10px' w={{base: "100%", md: "80%"}} alignItems='center' direction="column" p={2}>
                    {
                        (chonks.length > 0 || Object.keys(columns).length > 0) ? (
                            <Button onClick={clear} leftIcon={<RepeatIcon/>} my={4}>Start Over</Button>
                        ) : (
                            <>
                                <Text>Sample files — YTS Movies Dataset: <Link href="https://bafybeihrfq6hjyoffrxkhxqgx6jfgp5aeobcdomhrxnneie6qtiithzvmm.ipfs.w3s.link/yts-lite.json" target="_blank">Small</Link>, <Link href="https://bafybeign33qvdlfr2jy2di2vjqypr3uqjrqufjmydjoepmn4qacvtzxf6u.ipfs.w3s.link/yts.json" target="_blank">Large</Link></Text>
                                <br/>
                                <Dropzone onDrop={onDrop} maxFiles={1} accept={{
                                    'application/json': ['.json'],
                                }}>
                                    {({getRootProps, getInputProps}) => (
                                    < >
                                        <div {...getRootProps({
                                            className: 'dropzone',
                                            style:{
                                                height: '200px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '20px',
                                                borderWidth: '4px',
                                                borderStyle: 'dashed',
                                                minWidth: '100%'
                                            }
                                        })}>
                                        <input {...getInputProps()} />
                                        <p style={{textAlign:"center"}}>Drag n drop a JSON file here, or click to select a file</p>
                                        </div>
                                    </>
                                    )}
                                </Dropzone>
                            </>
                        )    
                    }
                    {
                        loading && (<>Parsing Data ...</>)
                    }
                    {
                        Object.keys(columns).length > 0 && (
                            <>
                                <Heading size="md" mt={2}>Let&#39;s start by creating a table</Heading>
                                <Text fontSize='sm' mb={2} mt={1}>Just hit run.</Text>
                                <SqlDetails key={'create'} id={0} total={1} sql={getCreateStatement(tname, columns)} />
                                <br/>
                                <Input placeholder="Enter your Full Table Name" onChange={(e)=>{
                                    setTname(e.currentTarget.value);
                                }}/>
                                <br/>
                                <br/>
                            </>
                        )
                    }
                    
                    {
                        chonks.length>0 && stats && (
                            <>
                                <Heading size="md" my={2}>Let&#39;s run all the needed SQL</Heading>
                                <Flex direction="column" w="100%">
                                    <Flex direction="column" w="100%" p={2} >
                                        {JSON.stringify(stats)}  
                                    </Flex>

                                    {chonks.map((sql, id)=><SqlDetails key={id} id={id} total={chonks.length} sql={sql} />)}
                                </Flex>
                            </>
                        )
                    }
                </Flex>
            </Flex> 
        </PageShell>
    )

}

function SqlDetails({id, total, sql}) {
    const { colorMode } = useColorMode();

    const { onCopy, hasCopied } = useClipboard(sql);
    const { data: signer } = useSigner();
    const addRecentTransaction = useAddRecentTransaction();

    const run = async () => {
        const db = new Database({signer});
        const { meta } = await db
                .prepare(sql)
                .run();

        console.log(meta)

        addRecentTransaction({
            hash: meta.txn.transactionHash,
            description: `Run SQL #${id+1} of ${total}`,
        });
    }

    return (
        <Flex direction="column" w="100%" p={2}>
            <Accordion allowToggle>
                <AccordionItem borderRadius="10px" borderWidth="1px" mt={2} borderColor={colorMode === 'light' ? '#0000001a' : '#ffffff1a'}>
                    <AccordionButton
                        as="div"
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        background={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
                        _hover={{
                            'background': colorMode === 'light' ? 'gray.300' : 'whiteAlpha.200'
                        }}
                        borderRadius="10px"
                        _expanded={{
                            'borderBottomRadius': 0
                        }}
                        py={4}
                        px={6}
                    >
                        <Text>#{id+1} of {total} ({stringSize(sql)})</Text>
                        <Flex alignItems='center'>
                            <ButtonGroup mr={2}>
                                <Button variant='solid' onClick={onCopy}>{hasCopied ? 'Copied' : 'Copy'}</Button>
                                <Button variant='solid' onClick={run}>Run</Button>
                            </ButtonGroup>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <SyntaxHighlighter language="sql" style={atomOneDark} wrapLongLines={true} wrapLines={true} customStyle={{
                            borderRadius: '10px',
                            fontSize: '12px',
                            padding: '10px'
                        }}>
                            {format(sql || "", { language: 'mysql'})}
                        </SyntaxHighlighter>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Flex>
    )
}