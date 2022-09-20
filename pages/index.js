import React, { useEffect, useRef, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex, Tag } from "@chakra-ui/react";
import { TablelandIcon } from "@/public/icons";

import {
  Avatar,
  FormControl,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {nameToAvatar, toProperCase} from "../utils/stringUtils";

export default function Home() {

  const router = useRouter();
  const searchBox = useRef();
  const [searchValue, setSearchValue] = useState('');

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
    console.log(error);
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
          <Flex direction="column" justifyContent="center" alignItems="center" w={{base:"100vw", md:"50vw"}}>
            <br/>
            <TablelandIcon width={{base: "90%", md: "400px"}} height="auto" />
            <br/><br/>
            <FormControl id="table-name" width={{base: "95%", md: "70%"}}>
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
          </Flex>
        </Flex>
    </>
  )
}
