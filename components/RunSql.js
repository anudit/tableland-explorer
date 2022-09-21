import React, { useEffect } from "react";
import { Input } from "@chakra-ui/react";
import init from 'https://cdn.jsdelivr.net/gh/tablelandnetwork/wasm-sqlparser/main.js';
import { useRouter } from "next/router";
import { Parser } from 'node-sql-parser';
import fetcher from "@/utils/fetcher";
import { nameToSubgraph, parseTableData } from "@/utils/stringUtils";

const SqlInput = ({sqlError, setSqlError, ...props}) => {
  const router = useRouter();
  const parser = new Parser();

  useEffect(()=>{
    init();
  },[])

  const onChangeSql = async (event) => {
    try {
        if (window.sqlparser.parse){
          if (event.target.value.trim() != ""){
            await window.sqlparser.parse(event.target.value);
            const ast = parser.astify(event.target.value);
            const reqTable = ast.from.length;
            let vCount = 0;

            for (let i = 0; i < ast.from.length; i++) {
              const tn = ast.from[i].table;
              let { valid } = parseTableData(tn);
              if (valid === true){
                const resp = await fetcher(nameToSubgraph(tn), "POST", {
                  query: `{
                    tables(where: {name: "${tn}"}) {
                      name
                      owner
                      tableId
                    }
                  }`
                })
                if (resp?.data?.tables.length>0){
                  vCount+=1;
                }
                else {
                  setSqlError(`Table not Found : ${tn}`);
                }
              }
              else {
                setSqlError(`Invalid Table Name : ${tn}`);
              }
            }
            if (reqTable == vCount){
              setSqlError(false);
            }
          }
          else {
            setSqlError(false);
          }
        }
        else {
          setSqlError('Parser not Loaded.');
        }
    } catch (error) {
      setSqlError(error.message);
    }
  }

  return (
    <Input
      placeholder='Run SQL'
      size='md'
      w="100%"
      onChange={onChangeSql}
      defaultValue={global?.window ? Object.fromEntries(new URLSearchParams(window.location.search))?.query.replaceAll('%25', '%').replaceAll('%2A', '*') : ""}
      mb={2}
      isInvalid={sqlError}
      focusBorderColor={sqlError ? 'red' : 'green.300'}
      onKeyUp={(event)=>{
        if (event.key == 'Enter' && !sqlError){
          router.push(`/interactive?query=${encodeURIComponent(event.currentTarget.value.replaceAll('%', '%25').replaceAll('*', '%2A'))}`);
        }
      }}
      {...props}
    />
  );
};

export default SqlInput;
