import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { Skeleton, Heading, Spinner, useColorModeValue, useDisclosure, useColorMode, Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip, Alert, AlertIcon, AlertTitle, AlertDescription  } from "@chakra-ui/react";
import { SqlIcon, TablelandSmallIcon } from "@/public/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {nameToAvatar, nameToChainName, toProperCase} from "../utils/stringUtils";
import { SearchIcon } from "@chakra-ui/icons";
import SqlInput from "@/components/RunSql";
import Meta from "@/components/Meta";
import { isAddress } from "ethers/lib/utils";
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
  const { ensToAddress } = useContext(EnsCacheContext);

  function infoClick(id){
    let selectData = exploreData
      .map(e=>e?.data?.tables)
      .flat()
      .sort((a, b) => parseInt(b.created) - parseInt(a.created));

    setActiveModalData(selectData[id]);
    onOpen();
  }

  const onChangeTest = (event) => {
    setSearchValue(event.target.value);
  }

  // Autocomplete Search
  const { data, error } = useSWR(`{
    tables(where: {name_contains_nocase: "${searchValue}"}, first: 2, orderBy: created, orderDirection: desc) {
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

  // Explore Feed
  const { data: exploreData } = useSWR(`{
    tables(first: 3, orderBy: created, orderDirection: desc, where: {historyCount_gt: 3}) {
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
                <Flex direction="column" width={{base: '100%', md: '600px'}}>
                  <br/>
                  <Heading ml={2}>Explore</Heading>
                  <br/>
                  <ActionsSection />
                  <br/>
                  <DetailsModal tableMetadata={activeModalData} onClose={onClose} isOpen={isOpen}/>
                  {
                      exploreData ? exploreData
                        .map(e=>e?.data?.tables)
                        .flat()
                        .sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})
                        .map((table, oid) => {
                          return (
                            <TableCard
                              key={oid}
                              tableName={table?.name}
                              table={table}
                              infoClick={()=>{
                                infoClick(oid)
                              }}
                            />
                          )
                      }) : (
                        <Spinner />
                      )
                  }
                </Flex>
            </Flex>
            <Flex direction="column" display={{base: 'none', lg: 'flex'}}>
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
    tables(first: 1, orderBy: created, orderDirection: desc) {
      tableId
      name
    }
  }`, multifetch);

  return (
    <Flex direction="column" width={{base: '100%', md: '200px'}} position="relative">
      <br/><br/>
      <Heading>Chains</Heading>
      <br/>
      <Skeleton isLoaded={data}>
        <Flex position="sticky" top="0px" direction="column">
        {
          data && data.map(e=>e?.data?.tables).flat().map(e=>(
            <Flex direction='row' align="center" key={e.name} mb={2}>
              <Avatar size="sm" src={nameToAvatar(e.name)} title={nameToChainName(e.name)} />
              <Flex direction='column' ml={4}>
                  <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                    {nameToChainName(e.name)}
                  </Text>
                  <Text>{e.tableId} Tables</Text>
              </Flex>
            </Flex>
          ))
        }
        </Flex>
      </Skeleton>
    </Flex>
  )
}

import { getLatestRigActions } from "@/utils/rigs";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/scrollbar';
import RigAction from "@/components/RigAction";
import { Autoplay } from "swiper";
import { EnsCacheContext } from "@/contexts/EnsCache";

const ActionsSection = () => {

  let [actions, setActions] = useState(null);

  useEffect(()=>{
    getLatestRigActions().then(e=>setActions(e));
  }, [])

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width={{base:'100vw', md: "100%" }}
    >
      <Swiper
        slidesPerView={1}
        modules={[Autoplay]}

        autoplay={{
          delay: 2000,
          pauseOnMouseEnter: true
        }}
      >
        {actions && actions?.map && actions.map((slide, sid) => (
          <SwiperSlide key={`slide-${sid}`}>
            <RigAction data={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
};
