import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { Heading, Spinner, useColorModeValue, useDisclosure, useColorMode, Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip, Alert, AlertIcon, AlertTitle, AlertDescription  } from "@chakra-ui/react";
import { SqlIcon, TablelandSmallIcon } from "@/public/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {nameToAvatar, nameToChainName, networkDeets, toProperCase} from "../utils/stringUtils";
import { SearchIcon } from "@chakra-ui/icons";
import SqlInput from "@/components/RunSql";
import Meta from "@/components/Meta";
import { isAddress } from "ethers/lib/utils";
import { ensToAddress } from "@/components/AddressOrEns";
import { SunIcon } from "@chakra-ui/icons";
import { MoonIcon } from "@chakra-ui/icons";
import DetailsModal from '@/components/DetailsModal';
import TableCard from "@/components/ExploreTableCard";

export default function Home() {

  const router = useRouter();
  const searchBox = useRef();
  const [searchValue, setSearchValue] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSqlMode, setSqlMode] = useState(false);
  const [sqlError, setSqlError] = useState(false);
  const [activeModalData, setActiveModalData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  function infoClick(id){
    setActiveModalData(data.map(e=>e?.data?.tables).flat()[id]);
    onOpen();
  }

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
          statement
          tokenURI
          created
          txnHash
          controller {
              id
          }
          historyCount
    }
  }`, multifetch);

  const { data: exploreData } = useSWR(`{
    tables(first: 10, orderBy: created, orderDirection: desc, where: {historyCount_gt: 4}) {
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
              controller {
                  id
              }
              historyCount
          }
  }`, multifetch);

  useEffect(()=>{
    if(error) console.log(error);
  }, [error]);

  return (
    <>
      <Meta />

      <Flex direction='column' m="0" h="max-content" alignItems='center'>

        <Flex
          direction="row"
          justifyContent="space-around"
          alignItems='center'
          h="70px"
          position='fixed'
          w="100%"
          background={useColorModeValue('#fcfcfcdb', '#0000005e')}
          backdropFilter='blur(20px)'
          zIndex={2}
        >
          <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            w={{base:"100vw", md:"50vw", lg: "30vw"}}
            p={2}
          >
            <TablelandSmallIcon boxSize={10} />
            <Flex direction="row" width="100%" ml={2} alignItems='center'>
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
                          background: colorMode === 'light' ? '#f2f2f2': '#191919',
                          borderRadius: '30px',
                          fontSize: '20px',
                          padding: '10px',
                          height: '50px',
                          paddingLeft: '20px'
                        }}
                      />
                      <AutoCompleteList id="setValue">
                        {data && data
                          .map(e=>e?.data?.tables)
                          .flat()
                          .sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})
                          .map((table, oid) => (
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
                          ))
                        }
                      </AutoCompleteList>
                    </AutoComplete>
                  </FormControl>
                ) : (
                  <SqlInput
                    sqlError={sqlError}
                    setSqlError={setSqlError}
                    defaultValue='SELECT image from rigs_80001_1881'
                    mt={2}
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
                  size='lg'
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
          <IconButton
            variant='outline'
            borderRadius='100%'
            size='lg'
            icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            mr={2}
          />
        </Flex>
        <Flex direction="row" justifyContent="space-around" mt="70px" w={{base: "100%", md: "80%"}}>
            <Flex direction="column" >
                  {
                    exploreData ? (
                      <Flex direction="column" width={{base: '100%', md: '600px'}}>
                        <br/><br/>
                        <Heading>Explore</Heading>
                        <br/>
                        <DetailsModal tableMetadata={activeModalData} onClose={onClose} isOpen={isOpen}/>
                        {
                            exploreData && exploreData
                              .map(e=>e?.data?.tables)
                              .flat()
                              .sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})
                              .map((table, oid) => {
                                return (
                                  <TableCard key={oid} tableName={table?.name} table={table} infoClick={()=>{
                                      infoClick(oid)
                                  }}/>
                                )
                            })
                        }
                      </Flex>
                    ) : (
                      <Flex w="100vw" h="100vh" justifyContent='center' alignItems='center'>
                          <Spinner />
                      </Flex>
                    )

                }
            </Flex>
            <Flex direction="column" position='static' display={{base: 'none', sm: 'none', md: 'flex'}}>
              <ChainsSection />
            </Flex>
        </Flex>
      </Flex>
    </>
  )
}

const ChainsSection = () => {

  const { colorMode } = useColorMode();

  const { data } = useSWR(`{
    tables(first: 10, orderBy: created, orderDirection: desc) {
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
        controller {
            id
        }
        historyCount
    }
  }`, multifetch);

  return (
    <Flex direction="column" position='fixed'>
      {
          data ? (
            <Flex direction="column" width={{base: '100%', md: '200px'}}>
              <br/><br/>
              <Heading>Chains</Heading>
              <br/>
                {Object.keys(networkDeets).map(e=>`x_${e}_1`).map(e=>(
                  <Flex direction='row' align="center" key={e} mb={2}>
                    <Avatar size="sm" src={nameToAvatar(e)} title={nameToChainName(e)} />
                    <Flex direction='column' ml={4}>
                        <Text fontSize='sm' color={colorMode === 'light' ? 'gray.200': 'whiteAlpha.700'}>{nameToChainName(e)}</Text>
                        <Text>31 Tables</Text>
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          ) : (
            <Flex w="100vw" h="100vh" justifyContent='center' alignItems='center'>
                <Spinner />
            </Flex>
          )

      }
    </Flex>
  )
}
