import React, {useRef, useState} from "react";
import { Box, Button, Textarea, InputGroup, InputRightElement } from "@chakra-ui/react";
import {MoonIcon} from "@chakra-ui/icons";
import { Parser } from "node-sql-parser";
import { nameToSubgraph } from "@/utils/stringUtils";
import fetcher from "@/utils/fetcher";

const getTableFromQuery = (query) => {
    try {
        const parser = new Parser();
        const ast = parser.astify(query);
        let res;
        if (ast.type == 'create') {
            res = ast.table[0].table;
        }
        else {
            res = ast['from'][0].table;
        }
        console.log(query, ast, res);
        return res;
    } catch (error) {
        return false;
    }
}


const GptInput = ({inputValue, setInputValue}) => {

    const gptQuery = useRef(null);
    const [loading, setLoading] = useState(false);

    async function getGptResult(){

        const completeTableName = getTableFromQuery(inputValue);

        if(Boolean(inputValue) && Boolean(completeTableName)){


            setLoading(true)

            let subgraph = nameToSubgraph(completeTableName);
            let data = await fetcher(subgraph, "POST", {
                query: `
                    query {
                        tables(where: {name: "${completeTableName}"}, first: 1) {
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
                            lastUpdated
                            controller {
                                id
                            }
                            historyCount
                            history {
                                id
                                statement
                                time
                                actionBy {
                                    id
                                }
                            }
                        }
                    }
                `
            })

            let creationStatement = data?.data?.tables[0]?.statement;
            let partialTableName = completeTableName.replace(`_${data?.data?.tables[0]?.tableId}`, '');

            creationStatement = creationStatement.replace(partialTableName, completeTableName)
            

            let resp = await fetch(`/api/gpt3`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: gptQuery.current.value,
                    schema: creationStatement
                })
            }).then(e=>e.json());
    
            if (resp?.generatedSQL) {
                setInputValue(resp?.generatedSQL.replace(';', ''))
            }
            else {
                console.error('Gpt error', resp);
            }

            setLoading(false)
        }
        else {
            console.log('First SELECT a valid table.')
            setLoading(false)
        }

    }


  return (
    <InputGroup size='md' py={2}>
      <Textarea
        ref={gptQuery}
        pr='4.5rem'
        mx={2}
        borderColor="#eee5"
        placeholder='Describe your query to ChatGPT and get back SQL'
      />
      <InputRightElement width='7rem'>
        <Button h='1.75rem' size='sm' mr={4} mt={4} onClick={getGptResult} isLoading={loading} leftIcon={<Box>✨</Box>} fontWeight={400}>
          Ask AI
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default GptInput;
