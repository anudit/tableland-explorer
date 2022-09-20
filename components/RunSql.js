import React, { useEffect } from "react";
import { Input } from "@chakra-ui/react";
import init from 'https://cdn.jsdelivr.net/gh/tablelandnetwork/wasm-sqlparser/main.js';
import { useRouter } from "next/router";

const SqlInput = ({sqlError, setSqlError, ...props}) => {
  const router = useRouter();

  useEffect(()=>{
    init();
  },[])

  const onChangeSql = async (event) => {
    try {
        if (window.sqlparser.parse){
            if (event.target.value.trim() != ""){
                await window.sqlparser.parse(event.target.value);
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
      defaultValue={global?.window ? Object.fromEntries(new URLSearchParams(window.location.search))?.query : ""}
      mb={2}
      isInvalid={sqlError}
      focusBorderColor={sqlError ? 'red' : 'green.300'}
      onKeyUp={(event)=>{
        if (event.key == 'Enter' && !sqlError){
          router.push(`/interactive?query=${encodeURIComponent(event.currentTarget.value)}`);
        }
      }}
      {...props}
    />
  );
};

export default SqlInput;
