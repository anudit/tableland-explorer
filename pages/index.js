import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { Stack, Skeleton, Heading, useColorModeValue, useDisclosure, useColorMode, Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip  } from "@chakra-ui/react";
import { SqlIcon, TablelandSmallIcon } from "@/public/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {encodeSqlForUrl, nameToAvatar, nameToChainName, networkDeets, toProperCase} from "../utils/stringUtils";
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
  const { ensToAddress, lensToAddress } = useContext(EnsCacheContext);
  const [sqlValue, setSqlValue] = useState("SELECT image from rigs_80001_1881");

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
                            if (searchValue.endsWith('.lens')) {
                              lensToAddress(searchValue).then(res=>{
                                if (isAddress(res)) router.push(`/address/${res}`)
                              })
                            }
                            if (searchValue.startsWith('#')) {
                              let rid = parseInt(searchValue.slice(1));
                              if (rid>0 && rid<=3000) router.push(`/rig/${rid}`)
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
                  <Tooltip placement="bottom" hasArrow label={sqlError || 'SQL looks good.' } bg={sqlError? 'red' : 'green.300'}>
                    <SqlInput
                      inputValue={sqlValue} setInputValue={setSqlValue}
                      sqlError={sqlError}
                      setSqlError={setSqlError}
                      mt={2}
                      style={{
                        borderRadius: '30px',
                        fontSize: '20px',
                        padding: '10px',
                        height: '50px',
                        paddingLeft: '20px'
                      }}
                      onKeyUp={(event)=>{
                        if (event.key == 'Enter' && !sqlError){
                          event.currentTarget.disabled = true;
                          router.push(`/interactive?query=${encodeSqlForUrl(event.currentTarget.value)}`);
                        }
                      }}
                    />
                  </Tooltip>
                )
              }
              <Tooltip
                label={isSqlMode ? 'Switch to Search Mode': 'Switch to SQL Mode'}
                aria-label={isSqlMode ? 'Switch to Search Mode': 'Switch to SQL Mode'}
                hasArrow
                placement='left'
              >
                <IconButton
                  variant='unstyled'
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
          </Flex>
          <Flex direction="row">
            {/* <Link href="/explore">
              {isLargerThanMd ? (
                <Button
                  variant='outline'
                  borderRadius='100px'
                  size='lg'
                  leftIcon={<AppsIcon />}
                  mr={2}
                  fontWeight="100"
                >
                  Discover
                </Button>
              ) : (
                <IconButton
                  variant='outline'
                  borderRadius='100%'
                  size='lg'
                  icon={<AppsIcon />}
                  mr={2}
                />
              )}
            </Link> */}
            <IconButton
              variant='outline'
              borderRadius='100%'
              size='lg'
              icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              mr={2}
            />
          </Flex>
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
                              mb={{base:0, md:2}}
                            />
                          )
                      }) : (
                        <TableCardSkeleton />
                      )
                  }
                </Flex>
            </Flex>
            <Flex direction="column" display={{base: 'none', lg: 'flex'}} position="relative">
              <ChainsSection />
            </Flex>
        </Flex>

        <BottomStats />
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
    <Flex direction="column" width={{base: '100%', md: '200px'}} position="sticky" top="50px">
      <br/><br/>
      <Heading>Networks</Heading>
      <br/>
      <Flex top="0px" direction="column">
        {
          data ? data.map(e=>e?.data?.tables).flat().map(e=>(
            <Flex direction='row' align="center" key={e.name} mb={2}>
              <Avatar size="sm" src={nameToAvatar(e.name)} title={nameToChainName(e.name)} />
              <Flex direction='column' ml={4}>
                  <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                    {nameToChainName(e.name)}
                  </Text>
                  <Text>{e.tableId} Tables</Text>
              </Flex>
            </Flex>
          )) : Object.keys(networkDeets).map(n=>(
            <Flex direction='row' align="center" key={n} mb={2}>
              <Avatar size="sm" src={networkDeets[n]?.avatar} title={networkDeets[n]?.name} />
              <Flex direction='column' ml={4}>
                <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                  {networkDeets[n]?.name}
                </Text>
                <Skeleton>
                  <Text>0 Tables</Text>
                </Skeleton>
              </Flex>
            </Flex>
          ))
        }
      </Flex>
      <GarageStatsSection/>
    </Flex>
  )
}

const GarageStatsSection = () => {

  const { colorMode } = useColorMode();
  const [data, setData] = useState(false);

  useEffect(()=>{
    garageStatsQuery().then(setData);
  }, [])

  return (
    <>
      <br/>
      <Heading>Garage</Heading>
      <br/>
      <Flex top="0px" direction="column">
        <Flex direction='column' align="left" key='num_rigs_in_flight' mb={2}>
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Rigs In-flight
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {parseInt(data['num_rigs_in_flight'])}
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='num_rigs_parked' mb={2}>
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Rigs Parked
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {3000-parseInt(data['num_rigs_in_flight'])}
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='num_pilots' mb={2}>
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Number of Pilots
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {parseInt(data['num_pilots'])}
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='total_flight_time' mb={2}>
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Total Flight Time
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {(parseInt(data['total_flight_time'])/(60*60*24*365)).toPrecision(2)} years
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='total_flight_time' mb={2}>
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Avg. Flight Time
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {(parseInt(data['total_flight_time'])/(60*60*parseInt(data['num_rigs_in_flight']))).toPrecision(2)} hours
            </Text>
          </Skeleton>
        </Flex>
      </Flex>
    </>
  )
}

import { garageStatsQuery, getLatestRigActions } from "@/utils/rigs";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import RigAction from "@/components/RigAction";
import { EnsCacheContext } from "@/contexts/EnsCache";
import BottomStats from "@/components/BottomStats";
import TableCardSkeleton from "@/components/ExploreTableCardShell";

const ActionsSection = () => {

  let [actions, setActions] = useState(null);
  const { colorMode } = useColorMode();

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
      >
        {actions && actions?.map ? actions.map((slide, sid) => (
          <SwiperSlide key={`slide-${sid}`}>
            <RigAction data={slide} />
          </SwiperSlide>
        )) : (
          <Flex
              borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
              borderWidth='1px'
              borderRadius={10}
              direction="column"
              p={4}
              mb={4}
          >
              <Stack w={{base: '300px', md: '550px'}}>
                  <Skeleton height='30px' />
                  <Skeleton height='40px' />
              </Stack>
          </Flex>
      )}
      </Swiper>
    </Flex>
  );
};
