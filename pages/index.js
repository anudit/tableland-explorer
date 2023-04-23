import React, { useEffect, useState } from "react";
import { SimpleGrid, Stack, Skeleton, Heading, useDisclosure, useColorMode, Flex, Avatar, Text  } from "@chakra-ui/react";
import useSWR from "swr";
import { multifetch } from "../utils/fetcher";
import { networkDeets } from "../utils/stringUtils";
import DetailsModal from '@/components/DetailsModal';
import TableCard from "@/components/ExploreTableCard";

export default function Home() {

  const [activeModalData, setActiveModalData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  function infoClick(id) {
    let selectData = exploreData
      .map(e=>e?.data?.tables)
      .flat()
      .sort((a, b) => parseInt(b.created) - parseInt(a.created));

    setActiveModalData(selectData[id]);
    onOpen();
  }

  // Explore Feed
  const { data: exploreData } = useSWR(`{
    tables(first: 3, orderBy: "created", orderDirection: "desc", where: {historyCount_gt: "3"}) {
        id
        name
        owner {
            id
        }
        tableId
        statement
        tokenURI
        lastUpdated
        created
        txnHash
        controller {
            id
        }
        historyCount
    }
  }`, multifetch);

  return (
    <PageShell>
      <>
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
        <BottomStats/>
      </>
    </PageShell>
  )
}

const ChainsSection = () => {

  const { colorMode } = useColorMode();

  const { data } = useSWR(`{
    tables(first: 1, orderBy: "created", orderDirection: "desc") {
      tableId
      name
    }
  }`, multifetch);

  return (
    <Flex direction="column" width={{base: '100%', md: '250px'}} position="sticky" top="50px">
      <br/><br/>
      <Heading size='lg'>⛓️ Networks</Heading>
      <br/>
      <Flex top="0px" direction="column">
          <Flex direction='column' align="center" key={0} mb={4} alignItems='flex-start'>
            <Flex direction="row" alignItems="center">
              <Avatar size="xs" src={networkDeets['1'].avatar} title={networkDeets['1'].name} mr={2}/>
              <Text fontWeight={600} fontSize='lg' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                Ethereum
              </Text>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Mainnet : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[0].tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Görli : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[1].tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Sepolia : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[9].tableId} Tables</Text>
              </Skeleton>
            </Flex>
          </Flex>
          <Flex direction='column' align="center" key={1} mb={4} alignItems='flex-start'>
            <Flex direction="row" alignItems="center">
              <Avatar size="xs" src={networkDeets['137'].avatar} title={networkDeets['137'].name} mr={2}/>
              <Text fontWeight={600} fontSize='lg' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                Polygon
              </Text>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Mainnet : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[2].tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Mumbai : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[3].tableId} Tables</Text>
              </Skeleton>
            </Flex>
          </Flex>
          <Flex direction='column' align="center" key={2} mb={4} alignItems='flex-start'>
            <Flex direction="row" alignItems="center">
              <Avatar size="xs" src={networkDeets['10'].avatar} title={networkDeets['10'].name} mr={2}/>
              <Text fontWeight={600} fontSize='lg' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                Optimism
              </Text>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Mainnet : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[4].tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Görli : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[5].tableId} Tables</Text>
              </Skeleton>
            </Flex>
          </Flex>
          <Flex direction='column' align="center" key={3} mb={4} alignItems='flex-start'>
            <Flex direction="row" alignItems="center">
              <Avatar size="xs" src={networkDeets['42161'].avatar} title={networkDeets['42161'].name} mr={2} backgroundColor="red"/>
              <Text fontWeight={600} fontSize='lg' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                Arbitrum
              </Text>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Mainnet : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[6].tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Nova : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[8].tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Görli : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[7].tableId} Tables</Text>
              </Skeleton>
            </Flex>
          </Flex>
          <Flex direction='column' align="center" key={4} mb={4} alignItems='flex-start'>
            <Flex direction="row" alignItems="center">
              <Avatar size="xs" src={networkDeets['314'].avatar} title={networkDeets['314'].name} mr={2} backgroundColor="transparent"/>
              <Text fontWeight={600} fontSize='lg' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                Filecoin EVM
              </Text>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Mainnet : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[10]?.tableId} Tables</Text>
              </Skeleton>
            </Flex>
            <Flex direction='row' ml={4} mt={1}>
              <Text size="sm" mr={1}>Hyperspace : </Text>
              <Skeleton isLoaded={Boolean(data)}>
                <Text size="sm">{!data ? "" : data.map(e=>e?.data?.tables).flat()[11]?.tableId} Tables</Text>
              </Skeleton>
            </Flex>
          </Flex>
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
      <Heading size='lg'>🏗️ Garage</Heading>
      <br/>
      <SimpleGrid columns={2} spacingX='40px' spacingY='4px' top="0px" direction="column">
        <Flex direction='column' align="left" key='numRigsInFlight' mb={2} w="120px">
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Rigs In-flight
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {parseInt(data['numRigsInFlight'])}
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='numRigsParked' mb={2} w="120px">
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Rigs Parked
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {3000-parseInt(data['numRigsInFlight'])}
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='totalFlightTime' mb={2} w="120px">
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Total Flight Time
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {(parseInt(data['totalFlightTime']*12.07)/(60*60*24*365)).toFixed(2)} years
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='avgFlightTime' mb={2} w="120px">
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Avg. Flight Time
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {(parseInt(data['avgFlightTime']*12.07)/(60*60*24)).toFixed(2)} days
            </Text>
          </Skeleton>
        </Flex>
        <Flex direction='column' align="left" key='numPilots' mb={2} w="120px">
          <Text fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
            Number of Pilots
          </Text>
          <Skeleton isLoaded={Boolean(data)}>
            <Text>
              {parseInt(data['numPilots'])}
            </Text>
          </Skeleton>
        </Flex>
      </SimpleGrid>
    </>
  )
}

import { garageStatsQuery, getLatestRigActions } from "@/utils/rigs";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import RigAction from "@/components/RigAction";
import BottomStats from "@/components/BottomStats";
import TableCardSkeleton from "@/components/ExploreTableCardShell";
import PageShell from "@/components/PageShell";

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
