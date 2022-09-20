import React, { useEffect, useRef, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip  } from "@chakra-ui/react";
import { SqlIcon, TablelandIcon } from "@/public/icons";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
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
    tables(where: {name_contains_nocase: "${searchValue}"}, limit: 100) {
      name
      owner
      tableId
    }
  }`, multifetch);

  useEffect(()=>{
    if(error) console.log(error);
  }, [error]);

  return (
    <>
        <Head>
            <title>Tableland Explorer</title>
            <meta name="title" content="Tableland Explorer" />
            <meta name="description" content="An explorer for Tableland Network." />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://tableland.xyz/" />
            <meta property="og:title" content="Tableland Explorer" />
            <meta property="og:description" content="An explorer for Tableland Network." />
            <meta property="og:image" content="https://i.imgur.com/5ErjwNI.png" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://tableland.xyz/" />
            <meta property="twitter:title" content="Tableland Explorer" />
            <meta property="twitter:description" content="An explorer for Tableland Network." />
            <meta property="twitter:image" content="https://i.imgur.com/5ErjwNI.png" />
        </Head>

        <Flex direction="column" p="200px" alignItems="center" h="100vh">
          <Flex direction="column" justifyContent="center" alignItems="center" w={{base:"100vw", md:"50vw", lg: "35vw"}}>
            <br/>
            <TablelandIcon width={{base: "90%", md: "400px"}} height="auto" />
            <br/><br/>
            <Flex direction="row" width="100%">
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
                        placeholder="Search Tableland"
                        autoComplete="off"
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
                  <SqlInput sqlError={sqlError} setSqlError={setSqlError} defaultValue='SELECT image from rigs_80001_1881'/>
                )
              }
              <Tooltip
                label={isSqlMode ? 'Switch to Search Mode': 'Switch to SQL Mode'}
                aria-label={isSqlMode ? 'Switch to Search Mode': 'Switch to SQL Mode'}
                hasArrow
                placement='left'
              >
                <IconButton variant='unstyled' icon={isSqlMode? <SqlIcon /> : <SearchIcon />} onClick={()=>{
                  setSqlMode(mode=>!mode);
                }}/>
              </Tooltip>
            </Flex>
            {
              isSqlMode && (sqlError ? (
                  <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>Parsing Error</AlertTitle>
                      <AlertDescription>{sqlError}</AlertDescription>
                  </Alert>
              ) : (
                  <Alert status='success'>
                      <AlertIcon />
                      Your SQL looks good.
                  </Alert>
              ))
            }
          </Flex>
        </Flex>
    </>
  )
}
