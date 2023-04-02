import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { Heading, HStack, Stack, Img, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuGroup, useDisclosure, useMediaQuery, Button, useColorModeValue, useColorMode, Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip  } from "@chakra-ui/react";
import { SqlIcon, TablelandSmallIcon, TreeIcon, UserIconOutline, WalletIcon, MoonIcon } from "@/public/icons";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {encodeSqlForUrl, nameToAvatar, toProperCase} from "../utils/stringUtils";
import SqlInput from "@/components/RunSql";
import { isAddress } from "ethers/lib/utils";
import { SearchIcon, SunIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { EnsCacheContext } from "@/contexts/EnsCache";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';

import Offset from "./Offset";
import { useAccount } from "wagmi";
import { MotionMenu, MotionMenuItem } from "./menu/Menu";

export default function UniversalSearch({children, defaultValue = "", customTitle = false}) {

  const router = useRouter();
  const searchBox = useRef();
  const {address} = useAccount();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSqlMode, setSqlMode] = useState(false);
  const [sqlError, setSqlError] = useState(false);
  const { ensToAddress, lensToAddress } = useContext(EnsCacheContext);
  const [sqlValue, setSqlValue] = useState("SELECT image from rigs_80001_1881");
  const { isOpen:isOpenClimate, onOpen:onOpenClimate, onClose:onCloseClimate } = useDisclosure();

  const onChangeTest = (event) => {
    setSearchValue(event.target.value);
  }

  const [isLargerThanMd] = useMediaQuery('(min-width: 1280px)')

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
          lastUpdated
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
    <Flex
        as="nav"
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
            justifyContent="flex-start"
            alignItems="center"
            w={{base:"100vw", md:"50vw", lg: "40vw"}}
            p={2}
        >
        <Link href="/">
            <TablelandSmallIcon boxSize={10} _hover={{fill: 'royalBlue'}}/>
        </Link>
        {
            customTitle && (
                <Heading size={{base:"xs", md:"sm"}} ml={2} minW="120px">{customTitle}</Heading>
            )
        }
        <Flex direction="row" width="100%" ml={2} alignItems='center' display={isLargerThanMd? 'flex': 'none'}>
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
                        // defaultValue={defaultValue || null}
                        placeholder="Search for Tables / #Rigs / Addresses / ENS Names"
                        autoComplete="off"

                        onKeyDown={(e)=>{
                            if(e.code == 'Enter'){
                                e.currentTarget.disabled = true;
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
                            {/* {searchValue && searchValue.trim() != "" && (
                                <AutoCompleteItem
                                    key={`option-${0}`}
                                    value={`${searchValue.toLowerCase()}.eth`}
                                    align="center"
                                    display='flex'
                                    flexDirection='row'
                                    alignItems="center"
                                >
                                    <Text ml="4" fontWeight={'medium'}>
                                        {searchValue.toLowerCase()}.eth
                                        <Tag size='sm' mt="2px" ml={2}>ENS</Tag>
                                    </Text>
                                </AutoCompleteItem>
                            )} */}
                        {data && data
                            .map(e=>e?.data?.tables)
                            .flat()
                            .sort(function(a, b){return parseInt(b.created) - parseInt(a.created)})
                            .map((table, oid) => (
                            <AutoCompleteItem
                                key={`option-${oid}`}
                                value={table?.name}
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
                        background={colorMode === 'dark'? 'rgb(25, 25, 25)': 'rgb(242, 242, 242)'}
                        border="none"
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
                                router.push(`/playground?query=${encodeSqlForUrl(event.currentTarget.value)}`);
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
                name="Search"
            />
            </Tooltip>
        </Flex>
        </Flex>
        <Flex direction="row" alignItems="center">
            {children && children}
            <MotionMenu>
                <MotionMenuItem item="Discover">
                    <HStack spacing={5} alignItems="start">
                        <Link href="/discover">
                            <Stack spacing={2}>
                                <Img
                                    h="6.4rem"
                                    w="8rem"
                                    bg="whiteAlpha.50"
                                    src="/images/tableverse.jpeg"
                                    objectFit="cover"
                                    rounded="xl"
                                    cursor="pointer"
                                    alt="Apps built on Tableland"
                                />
                                <Flex direction="column">
                                    <Text fontWeight={600}>Tableverse</Text>
                                    <Text fontSize='x-small'>Discover apps using <br/>Tableland Network</Text>
                                </Flex>
                            </Stack>
                        </Link>

                        <Link href="/playground">
                            <Stack spacing={2}>
                                <Img
                                    h="6.4rem"
                                    w="8rem"
                                    bg="whiteAlpha.50"
                                    src="/images/playground.jpeg"
                                    objectFit="cover"
                                    rounded="xl"
                                    cursor="pointer"
                                    alt="Beverage Can"
                                />
                                <Flex direction="column">
                                    <Text fontWeight={600}>Playground</Text>
                                    <Text fontSize='x-small'>Test out the <br/>Tableland Network</Text>
                                </Flex>
                            </Stack>
                        </Link>
                    </HStack>
                    <HStack spacing={5} alignItems="start" mt={4}>
                        <Stack spacing={2}>
                            <Img
                                h="6.4rem"
                                w="8rem"
                                bg="whiteAlpha.50"
                                src="/images/rigs.jpeg"
                                objectFit="cover"
                                rounded="xl"
                                alt="Rigs"
                                filter="grayscale(1)"
                            />
                            <Flex direction="column">
                                <Text fontWeight={600}>Rigs</Text>
                                <Text fontSize='x-small'>Discover Rigs in the <br/> Tableland Network.</Text>
                            </Flex>
                        </Stack>
                    </HStack>
                </MotionMenuItem>
                <MotionMenuItem item="Create">
                    <HStack spacing={5} alignItems="start">
                        <Link href="/create/table">
                            <Stack spacing={2}>
                                <Img
                                    h="6.4rem"
                                    w="8rem"
                                    bg="whiteAlpha.50"
                                    src="/images/tables.jpeg"
                                    objectFit="cover"
                                    rounded="xl"
                                    alt="Create Table"
                                />
                                <Flex direction="column">
                                    <Text fontWeight={600}>Tables</Text>
                                    <Text fontSize='x-small'>Create Tables on <br/>Tableland Network</Text>
                                </Flex>
                            </Stack>
                        </Link>
                        <Stack spacing={2}>
                            <Img
                                h="6.4rem"
                                w="8rem"
                                bg="whiteAlpha.50"
                                src="/images/forms.jpeg"
                                objectFit="cover"
                                rounded="xl"
                                alt="Create Forms on Tableland"
                                filter="grayscale(1)"
                            />
                            <Flex direction="column">
                                <Text fontWeight={600}>Forms</Text>
                                <Text fontSize='x-small'>Create Forms powered <br/> by Tableland Network</Text>
                            </Flex>
                        </Stack>
                        
                    </HStack>
                    <HStack spacing={5} alignItems="start" mt={4}>
                        <Stack spacing={2}>
                            <Img
                                h="6.4rem"
                                w="8rem"
                                bg="whiteAlpha.50"
                                src="/images/dashboards.jpeg"
                                objectFit="cover"
                                rounded="xl"
                                alt="Dashboards"
                                filter="grayscale(1)"
                            />
                            <Flex direction="column">
                                <Text fontWeight={600}>Dashboards</Text>
                                <Text fontSize='x-small'>SQL powered Data <br/> Dashboards</Text>
                            </Flex>
                        </Stack>
                        <Link href="/import">
                            <Stack spacing={2}>
                                <Img
                                    h="6.4rem"
                                    w="8rem"
                                    bg="whiteAlpha.50"
                                    src="/images/import.jpeg"
                                    objectFit="cover"
                                    rounded="xl"
                                    cursor="pointer"
                                    alt="Import"
                                />
                                <Flex direction="column">
                                    <Text fontWeight={600}>Import</Text>
                                    <Text fontSize='x-small'>Quickly bring your Data <br/> into Tableland Network</Text>
                                </Flex>
                            </Stack>
                        </Link>
                    </HStack>
                </MotionMenuItem>
            </MotionMenu>
            <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                <div
                    {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    },
                    })}
                >
                    {(() => {
                    if (!connected) {
                        if (!isLargerThanMd){
                            return (
                                <IconButton
                                    variant='outline'
                                    borderRadius='100%'
                                    size='lg'
                                    icon={<WalletIcon />}
                                    onClick={openConnectModal}
                                    mr={2}
                                />
                            )
                        }
                        else return (
                            <Button
                                variant='outline'
                                borderRadius='100px'
                                size='lg'
                                leftIcon={<WalletIcon />}
                                mx={2}
                                fontWeight="100"
                                onClick={openConnectModal}
                            >
                                Connect Wallet
                            </Button>
                        );
                    }

                    if (chain.unsupported) {
                        return (
                            <button onClick={openChainModal} type="button">
                                Wrong network
                            </button>
                        );
                    }

                    return (
                        <div>
                            {
                                <Menu >
                                    {
                                        isLargerThanMd ? (
                                            <MenuButton
                                                as={Button}
                                                leftIcon={chain.hasIcon ? <Avatar src={chain.iconUrl} size="xs" /> : undefined}
                                                rightIcon={<ChevronDownIcon />}
                                                variant='outline'
                                                borderRadius='100px'
                                                size='lg'
                                                fontWeight="100"
                                                mr={2}
                                            >
                                                {account.displayName}
                                            </MenuButton>
                                        ) : (
                                            <MenuButton
                                                as={IconButton}
                                                icon={<ChevronDownIcon />}
                                                variant='outline'
                                                borderRadius='100%'
                                                size='lg'
                                                mr={2}
                                            />
                                        )
                                    }
                                    <MenuList>
                                        <MenuGroup title="Tablescan">
                                            <MenuItem icon={<TreeIcon />} onClick={onOpenClimate}> <Offset onClose={onCloseClimate} isOpen={isOpenClimate}/></MenuItem>
                                            <MenuItem icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode}>Toggle Theme</MenuItem>
                                        </MenuGroup>
                                        <MenuDivider />
                                        <MenuGroup title='Account'>
                                            <MenuItem icon={<UserIconOutline />} onClick={()=>{
                                                router.push(`/address/${address}`)
                                            }}>My Profile</MenuItem>
                                            <MenuItem icon={<WalletIcon />} onClick={openAccountModal}>Disconnect</MenuItem>
                                        </MenuGroup>
                                    </MenuList>
                                </Menu>
                            }
                        </div>
                    );
                    })()}
                </div>
                );
            }}
            </ConnectButton.Custom>
        </Flex>
    </Flex>
  )
}
