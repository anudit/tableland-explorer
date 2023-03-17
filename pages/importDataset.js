import React, { useState } from "react";
import { ButtonGroup, Code, Box, Heading, Button, useColorMode, Flex, Text } from "@chakra-ui/react";

import UniversalSearch from "@/components/UniversalSearch";
import Footer from "@/components/Footer";
import Meta from "@/components/Meta";
import { stringSize } from "@/utils/stringUtils";


import Dropzone from 'react-dropzone';
import dynamic from "next/dynamic";
const ReactJson = dynamic(() => import('react-json-view'), {
    ssr: false,
  })

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

const getSize = (st) => { 
    let size = new Blob([st]).size;
    return size;
}

const formatForSql = (typeName, value) => {
    if (typeName.toUpperCase() == 'INTEGER') {
        return `${value}`
    }
    else {
        return `'${value.toString()}'` 
    }
}



export default function DiscoverPage() {

    const [columns, setColumns] = useState([]);
    const [chonks, setChonks] = useState([]);
    const [stats, setStats] = useState(false);
    const [loading, setLoading] = useState(false);
    // const { data: signer } = useSigner();

    function convertJsonToChonks(name, schema, completeData){

        let createStatement  = `CREATE TABLE ${name} (${Object.entries(schema).map(([cname, ctype])=>`${cname} ${ctype}`).toString()});`;

        let allStatements = [createStatement];
        let currentStatement = null;
        let currentIndex = 0;
    
        while (currentIndex < completeData.length) { 
            
            if (currentStatement === null){
                currentStatement = `INSERT INTO ${name} VALUES (`
            }
    
            let staged = Object
                            .entries(completeData[currentIndex])
                            .filter(e=>{
                                return Object.keys(schema).includes(e[0])
                            })
                            .map(([cname, cval])=>`${formatForSql( schema[cname] ,cval)}`).toString();
            let stageSize = getSize(currentStatement + staged + ');');
    
            if (stageSize <= 14000){ // 14kb
                currentStatement += staged;
            }
            else {
                currentStatement+= ');';

                allStatements.push(currentStatement); 

                currentStatement = null;
            }
    
            currentIndex++;
        }

        currentStatement+= ');';
        allStatements.push(currentStatement); 

        return allStatements;  

    }

    const clear = () => {
        setColumns({}) 
        setChonks([])
        setStats(false)
        setLoading(false)
    }

    const onDrop = (files) => {
        setLoading(true);
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                let fname = files[0].name.split('.')[0];
                let data = JSON.parse(e.target.result);
                let cols = Object.keys(data[0]);
                let colsParsed = {};
                for (let index = 0; index < Math.min(cols.length, 24); index++) {
                    const element = data[0][cols[index]];
                    if (typeof element === 'number') {
                        colsParsed[cols[index]] = 'integer';
                    }
                    else {
                        colsParsed[cols[index]] = 'text';
                    }
                }
                console.log('colsParsed', colsParsed);
                setColumns(colsParsed);

                let resp = convertJsonToChonks(fname, colsParsed, data);
                setChonks(resp);

                setStats({
                    fileSize: e.target.size,
                    rows: data.length,
                    columns: Object.keys(colsParsed).length,
                    chunks: resp.length 
                })

                setLoading(false)
            } catch (error) {
                alert(error)
                clear();
            }
            
        };
        reader.readAsText(files[0]);
    };

    return (
        <Flex
            direction='column'
            fontFamily='inherit'
            backgroundImage="url(/lightbackground.png)"
            backgroundRepeat="no-repeat"
            backgroundPosition="top right"
            backgroundAttachment="fixed"
        >
            <Meta title="Import Dataset | Tablescan.io"/> 
            <UniversalSearch />
            
            <Flex w="100%" direction="column" mt="70px" alignItems="center" minH="100vh">
                <Flex mt='30px' w={{base: "100%", md: "80%"}} alignItems='center' direction="column">
                    <Heading mt="20px">Import Dataset</Heading>
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
                            <p>Drag n drop a JSON file here, or click to select a file</p>
                            </div>
                        </>
                        )}
                    </Dropzone>
                    <ButtonGroup>
                        {
                           chonks.length> 0 && (
                                <Button onClick={clear}>Clear</Button>
                           )
                        }
                    </ButtonGroup>
                    {
                        loading && (<>Parsing Data ...</>)
                    }
                    {
                        Object.keys(columns).length > 0 && (
                            <ReactJson 
                                src={columns} 
                                theme={'colors'} 
                                name={'tableSchema'} 
                                style={{padding: '5px', borderRadius: '5px', lineBreak:'anywhere', width: "100%"}} 
                                sortKeys={true}
                                displayDataTypes={false}
                            />
                        )
                    }
                    {
                        chonks && stats && (
                            <Flex direction="column" w="100%">
                                <Flex direction="column" w="100%" p={2} >
                                    {JSON.stringify(stats)}  
                                </Flex>

                                {chonks.map((sql, id)=><SqlDetails key={id} total={chonks.length} sql={sql} />)}
                            </Flex>
                        )
                    }
                </Flex>

            </Flex> 

            <Footer/>
        </Flex>
    )

}

function SqlDetails({key, total, sql}) {
    const { colorMode } = useColorMode();
    return (
        <Flex direction="column" w="100%" p={2} key={key}>
            <Flex direction="row" w="100%">
                <Text>#{key+1} of {total}</Text>
                <Button>Run</Button>
            </Flex>
            <Flex w="100%">
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                        <AccordionButton
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
                            <Box as="span" flex='1' textAlign='left'>
                                Preview SQL ({stringSize(sql)})
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Code style={{
                                lineBreak: 'anywhere'
                            }}>
                                {sql}
                            </Code>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

            </Flex>
        </Flex>
    )
}