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

  const { data, error } = useSWR([searchValue], multifetch);

  useEffect(()=>{
    console.log(error);
  }, [error]);

  return (
    <>
        <Head>
            <title>Tableland Explorer</title>
            <meta name="description" content="Tableland Explorer" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex direction="column" p="200px" alignItems="center" h="100vh">
          <Flex direction="column" justifyContent="center" alignItems="center" w={{base:"100vw", md:"50vw"}}>
            <br/>
            <TablelandIcon width="400px" height="auto" />
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
                  {data && data?.map((table, oid) => (
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
