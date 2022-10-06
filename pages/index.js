import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip, Alert, AlertIcon, AlertTitle, AlertDescription  } from "@chakra-ui/react";
import { SqlIcon, TablelandSmallIcon } from "@/public/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {nameToAvatar, toProperCase} from "../utils/stringUtils";
import { SearchIcon } from "@chakra-ui/icons";
import SqlInput from "@/components/RunSql";
import Meta from "@/components/Meta";
import { isAddress } from "ethers/lib/utils";
import { ensToAddress } from "@/components/AddressOrEns";

export default function Home() {

  const router = useRouter();
  const searchBox = useRef();
  const [searchValue, setSearchValue] = useState('');
  const [isSqlMode, setSqlMode] = useState(false);
  const [sqlError, setSqlError] = useState(false);

  const onChangeTest = (event) => {
    setSearchValue(event.target.value);
  }

  const { data, error } = useSWR(`{
    tables(where: {name_contains_nocase: "${searchValue}"}, first: 10, orderBy: created, orderDirection: desc) {
      name
      owner {
        id
      }
      tableId
    }
  }`, multifetch);

  useEffect(()=>{
    if(error) console.log(error);
  }, [error]);

  return (
    <>
      <Meta />

      <Flex direction='column' m="0" h="max-content">

        <Flex direction="row" justifyContent="space-around" h="70px" position='fixed' w="100%">
          <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            w={{base:"100vw", md:"50vw", lg: "30vw"}}
            p={2}
          >
            <TablelandSmallIcon boxSize={10} />
            <Flex direction="row" width="100%" mx={2}>
              {
                !isSqlMode ? (
                  <FormControl id="table-name" w="100%">
                    <AutoComplete openOnFocus onSelectOption={(data)=>{
                      router.push(`/${data.item.value}`);
                    }}>
                      <AutoCompleteInput
                        variant="filled"
                        ref={searchBox}
                        autoFocus
                        onChange={onChangeTest}
                        placeholder="Search for Tables or ENS Names"
                        autoComplete="off"
                        onKeyDown={(e)=>{
                          if(e.code == 'Enter'){
                            if (isAddress(searchValue)) router.push(`/address/${searchValue}`);
                            if (searchValue.endsWith('.eth')) {
                              ensToAddress(searchValue).then(res=>{
                                if (isAddress(res)) router.push(`/address/${res}`)
                              })
                            }
                          }
                        }}
                        style={{
                          borderRadius: '30px',
                          fontSize: '20px',
                          padding: '10px',
                          height: '50px',
                          paddingLeft: '20px'
                        }}
                      />
                      <AutoCompleteList id="setValue">
                        {data && data.map(e=>e?.data?.tables).flat().map((table, oid) => (
                          <AutoCompleteItem
                            key={`option-${oid}`}
                            value={table.name}
                            align="center"
                            display='flex'
                            flexDirection='row'
                            alignItems="center"
                          >
                            <Avatar size="sm" bg='whiteAlpha.500' src={nameToAvatar(table.name)} />
                            <Text ml="4" fontWeight={'medium'}>
                              {toProperCase(table.name.split("_").slice(0,-2).join(' '))}&nbsp;
                              <Tag size='sm' mt="2px">#{table.tableId}</Tag>
                            </Text>
                          </AutoCompleteItem>
                        ))}
                      </AutoCompleteList>
                    </AutoComplete>
                  </FormControl>
                ) : (
                  <SqlInput
                    sqlError={sqlError}
                    setSqlError={setSqlError}
                    defaultValue='SELECT image from rigs_80001_1881'
                    style={{
                      borderRadius: '30px',
                      fontSize: '20px',
                      padding: '10px',
                      height: '50px',
                      paddingLeft: '20px'
                    }}
                  />
                )
              }
              <Tooltip
                label={isSqlMode ? 'Switch to Search Mode': 'Switch to SQL Mode'}
                aria-label={isSqlMode ? 'Switch to Search Mode': 'Switch to SQL Mode'}
                hasArrow
                placement='left'
              >
                <IconButton
                  variant='outline'
                  borderRadius='100%'
                  icon={isSqlMode? <SqlIcon boxSize={6}/> : <SearchIcon />}
                  width={14}
                  height={12}
                  ml={2}
                  onClick={()=>{
                    setSqlMode(mode=>!mode);
                  }}
                />
              </Tooltip>
            </Flex>
            {
              isSqlMode && sqlError && (
                  <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>Parsing Error</AlertTitle>
                      <AlertDescription>{sqlError}</AlertDescription>
                  </Alert>
              )
            }
          </Flex>
          <div></div>
        </Flex>
        {/* <Flex direction="row" justifyContent="space-around" mt="70px" w="100%">
            <Flex direction="column">
              <Flex>
                xx
              </Flex>
            </Flex>
            <Flex direction="column">
              <Flex>
                xx
              </Flex>
            </Flex>
        </Flex> */}
      </Flex>
    </>
  )
}
