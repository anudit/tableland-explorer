import React, { forwardRef, useEffect } from "react";
import { init } from "@tableland/sqlparser";
import { Parser } from 'node-sql-parser';
import fetcher from "@/utils/fetcher";
import { nameToSubgraph, parseTableData } from "@/utils/stringUtils";
import Editor from "@monaco-editor/react";
import { useColorMode } from "@chakra-ui/react";

const SqlEditor = ({inputValue, setInputValue, setSqlError, ...props}, ref) => {

  const parser = new Parser();
  const { colorMode } = useColorMode();

  useEffect(()=>{
    init().then(function () {
      console.log('SQL parser loaded');
      test();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function test(){
    try {
        if (Boolean(global.sqlparser) === true && Boolean(global.sqlparser?.normalize) === true){
          if (inputValue.trim() != ""){
            await global.sqlparser.normalize(inputValue);
            const ast = parser.astify(inputValue);
            const reqTable = ast.from.length;
            let vCount = 0;

            for (let i = 0; i < ast.from.length; i++) {
              const tn = ast.from[i].table;
              let { valid } = parseTableData(tn);
              if (valid === true){
                const resp = await fetcher(nameToSubgraph(tn), "POST", {
                  query: `{
                    tables(where: {name: "${tn}"}) {
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
          setSqlError('Loading SQL Parser, Just a sec.');
        }
    } catch (error) {
      setSqlError(error.message);
    }
  }

  useEffect(()=>{
    test()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[inputValue])

  return (
    <Editor
      ref={ref}
      w="100%"
      defaultLanguage="sql"
      options={{
        minimap:{enabled: false}
      }}
      theme={colorMode === 'dark' ? "vs-dark" : "light"}
      onChange={(value)=>{
        setInputValue(value.trim())
      }}
      value={inputValue}
      style={{
        borderRadius: '32px'
      }}
      {...props}
    />
  );

};

export default forwardRef(SqlEditor);
