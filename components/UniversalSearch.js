import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { useMediaQuery, Button, useColorModeValue, useColorMode, Flex, Tag, Avatar, FormControl, Text, IconButton, Tooltip  } from "@chakra-ui/react";
import { AppsIcon, SqlIcon, TablelandSmallIcon } from "@/public/icons";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import useSWR from "swr";
import {multifetch} from "../utils/fetcher";
import {encodeSqlForUrl, nameToAvatar, toProperCase} from "../utils/stringUtils";
import SqlInput from "@/components/RunSql";
import { isAddress } from "ethers/lib/utils";
import { SearchIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { EnsCacheContext } from "@/contexts/EnsCache";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletIcon } from "out/icons";

export default function UniversalSearch({children, defaultValue}) {

  const router = useRouter();
  const searchBox = useRef();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSqlMode, setSqlMode] = useState(false);
  const [sqlError, setSqlError] = useState(false);
  const { ensToAddress, lensToAddress } = useContext(EnsCacheContext);
  const [sqlValue, setSqlValue] = useState("SELECT image from rigs_80001_1881");

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
            justifyContent="center"
            alignItems="center"
            w={{base:"100vw", md:"50vw", lg: "40vw"}}
            p={2}
        >
        <Link href="/">
            <TablelandSmallIcon boxSize={10} _hover={{fill: 'royalBlue'}}/>
        </Link>
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
                        // defaultValue={defaultValue || null}
                        placeholder="Search for Tables or ENS Names"
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
                name="Search"
            />
            </Tooltip>
        </Flex>
        </Flex>
        <Flex direction="row" alignItems="center">
            {children && children}
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
                                isLargerThanMd ? (
                                    <Button
                                        variant='outline'
                                        borderRadius='100px'
                                        size='lg'
                                        leftIcon={chain.hasIcon ? <Avatar src={chain.iconUrl} size="xs" /> : undefined}
                                        fontWeight="100"
                                        onClick={openAccountModal}
                                    >
                                        {account.displayName}
                                    </Button>
                                ) : (
                                    <IconButton
                                        variant='outline'
                                        borderRadius='100%'
                                        size='lg'
                                        icon={chain.hasIcon ? <Avatar src={chain.iconUrl} size="xs" /> : undefined}
                                        onClick={openAccountModal}
                                    />
                                )
                            }
                        </div>
                    );
                    })()}
                </div>
                );
            }}
            </ConnectButton.Custom>
            <Link href="/discover">
                {isLargerThanMd ? (
                    <Button
                        variant='outline'
                        borderRadius='100px'
                        size='lg'
                        leftIcon={<AppsIcon />}
                        mx={2}
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
                        mx={2}
                    />
                )}
            </Link>
            <IconButton
                variant='outline'
                borderRadius='100%'
                size='lg'
                icon={colorMode== 'dark' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                mr={2}
                name="Switch Theme"
            />
        </Flex>
    </Flex>
  )
}
