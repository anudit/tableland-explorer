import React, { useEffect, useState } from "react";
import { IconButton, ButtonGroup, Select, Switch, Input, Button, Flex } from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { useSigner } from "wagmi";
import { Database } from "@tableland/sdk";
import PageShell from "@/components/PageShell";
import { format } from "sql-formatter";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useChainId } from "wagmi";
import { TerminalIcon } from "@/public/icons";

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
            description: `Create Table`,
        });
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
                <Flex mt='10px' w={{base: "100%", md: "70%"}} alignItems='center' direction="column" p={2}>
                    <Input placeholder="Table Name" defaultValue='New Table' maxW="300px" onChange={(e)=>{
                        setTableName(e.currentTarget.value);
                    }} mb={2}/>

                    <TableContainer mb={2}> 
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Type</Th>
                                    <Th>Not Null</Th>
                                    <Th>Primary Key</Th>
                                    <Th>Unique</Th>
                                    <Th>Default Value</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    tableDetails.map((tableDetail, colInd)=>{
                                        return (
                                            <Tr key={colInd} >
                                                <Td>
                                                    <Input value={tableDetail.name} onChange={(e)=>{
                                                        updateTableDetails(colInd, 'name', e.currentTarget.value.replace(' ', '_'))
                                                    }}/>
                                                </Td>
                                                <Td>
                                                    <Select value={tableDetail.type} onChange={(e)=>{
                                                        updateTableDetails(colInd, 'type', e.currentTarget.value)
                                                    }}>
                                                        <option value={columnTypes.INTEGER}>{columnTypes.INTEGER}</option>
                                                        <option value={columnTypes.TEXT}>{columnTypes.TEXT}</option>
                                                    </Select>
                                                </Td>
                                                <Td>
                                                    <Switch value={tableDetail.isNotNull} onChange={(e)=>{
                                                        updateTableDetails(colInd, 'isNotNull', e.currentTarget.checked)
                                                    }}/>
                                                </Td>
                                                <Td>
                                                    <Switch value={tableDetail.isPrimaryKey} onChange={(e)=>{
                                                        updateTableDetails(colInd, 'isPrimaryKey', e.currentTarget.checked)
                                                    }}/>
                                                </Td>
                                                <Td>
                                                    <Switch value={tableDetail.isUnique} onChange={(e)=>{
                                                        updateTableDetails(colInd, 'isUnique', e.currentTarget.checked)
                                                    }}/>
                                                </Td>
                                                <Td>
                                                    <Input value={tableDetail.defaultValue} onChange={(e)=>{
                                                        updateTableDetails(colInd, 'defaultValue', e.currentTarget.value)
                                                    }}/>
                                                </Td>
                                                <Td>
                                                    <IconButton variant='ghost' icon={<DeleteIcon onClick={()=>{
                                                        removeTableColumn(colInd)
                                                    }}/>} />
                                                </Td>
                                                
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>

                    <SyntaxHighlighter language="sql" style={atomOneDark} wrapLongLines={true} wrapLines={true} customStyle={{
                        borderRadius: '10px',
                        fontSize: '12px',
                        width: '100%'
                    }}>
                        {format(sql || "", { language: 'mysql'})}
                    </SyntaxHighlighter>
                    <Flex mt={2}>
                        <ButtonGroup size="sm">
                            <Button leftIcon={<PlusSquareIcon/>} onClick={addTableColumn}>Add Column</Button>
                            <Button leftIcon={<TerminalIcon/>} onClick={run}>Run SQL</Button>
                        </ButtonGroup>
                    </Flex>
                </Flex>
            </Flex> 
        </PageShell>
    )

}
