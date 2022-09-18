import React, { useRef, useState } from "react";
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
import fetcher from "../utils/fetcher";
import {truncateAddress} from "../utils/stringUtils";

export default function Home() {

  const router = useRouter();
  const searchBox = useRef();
  const [searchValue, setSearchValue] = useState('');

  const onChangeTest = (event) => {
    setSearchValue(event.target.value);
  }

  const { data } = useSWR(
    ['https://api.thegraph.com/subgraphs/name/anudit/tableland', "POST", {
      query: `{
        tables(where: {name_contains_nocase: "${searchValue}"}) {
          name
          owner
          tableId
        }
      }`,
      variables: null
    }],
    fetcher
  );

  return (
    <>
        <Head>
            <title>Tableland Explorer</title>
            <meta name="description" content="Tableland Explorer" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex direction="column" p="200px" alignItems="center" h="100vh">
          <Flex direction="column" justifyContent="center" alignItems="center" w={{base:"100vw", md:"50vw"}}>
            <TablelandIcon boxSize={64} height="100px"/>
            <br/>
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
                  {data && data?.data?.tables?.map((table, oid) => (
                    <AutoCompleteItem
                      key={`option-${oid}`}
                      value={table.name}
                      align="center"
                    >
                      <Avatar size="sm" name={table.name} src={table.image} />
                      <Text ml="4">{table.name}<Tag>{truncateAddress(table.owner)}</Tag></Text>
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
