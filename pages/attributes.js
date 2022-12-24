import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Stack, useColorMode, Button, Text, Flex } from "@chakra-ui/react";
import Link from 'next/link';

import Meta from '@/components/Meta';
import Image from 'next/image';

const UserSection = () => {

    const { colorMode } = useColorMode();

    const router = useRouter();
    const { search } = router.query;

    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState(false);

    useEffect(()=>{
        if (search && search.trim() != ""){
            setSearchValue(decodeURIComponent(search))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[router])

    const onChangeTest = (event) => {
        setSearchValue(event.target.value);
    }

    useEffect(()=>{
        fetch(`https://api.verbwire.com/v1/nft/data/searchAttributesInSlug?searchString=${searchValue}&slug=tableland-rigs&chain=ethereum&limit=15&page=1&sortField=value&sortDirection=DESC&includeTokens=true`, {
            method:"GET",
            headers: {
                'X-API-Key':'sk_live_6bb811bd-5636-4734-8c96-005f8b0c9e44',
                'Accept': 'application/json'
            }
        }).then(e=>e.json()).then((res)=>{
            console.log(res);
            setResults(res);
        })
    }, [searchValue])

    return (
        <>
            <Meta title={'Atttribute Search'} />
            <Flex
                direction="row"
                justifyContent="space-around"
                alignItems='center'
                h="70px"
                position='fixed'
                w="100%"
                background={colorMode == 'white' ? '#fcfcfcdb' : '#0000005e'}
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
                    <Input
                        value={searchValue}
                        onChange={onChangeTest}
                        style={{
                            background: colorMode === 'light' ? '#f2f2f2': '#191919',
                            borderRadius: '30px',
                            fontSize: '20px',
                            padding: '10px',
                            height: '50px',
                            paddingLeft: '20px'
                        }}
                    />
                </Flex>
            </Flex>
            <Flex position="relative" height="100vh" width="100%">
                <Stack direction="column" spacing='24px' mt={20} w="100%" align="center">
                    {
                        results && results?.attributes?.results && results.attributes.results.map(data=>{
                            return (
                                <Flex key={data.id} direction="column" w="90vw">
                                    <Text>{data.key} - {data.value}</Text>
                                    <Stack direction="row" spacing='14px' my={2}  overflowX="scroll">
                                        {
                                            data.tokens.map(tid=>(
                                                <Flex
                                                    direction="column"
                                                    minWidth="100px"
                                                    minHeight='120px'
                                                    key={tid}
                                                    borderRadius={4}
                                                    borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
                                                    my={2}
                                                >
                                                    <Image
                                                        src={`https://tableland.mypinata.cloud/ipfs/bafybeidpnfh2zc6esvou3kfhhvxmy2qrmngrqczj7adnuygjsh3ulrrfeu/${tid}/image_thumb.png`}
                                                        width={100}
                                                        height={100}
                                                        alt={`Rig #${tid}`}
                                                        style={{
                                                            borderRadius: '10px'
                                                        }}

                                                    />
                                                    <Link href={`/rig/${tid}`}>
                                                        <Button size="xs" mt={1} w="100%">View Rig #{tid}</Button>
                                                    </Link>
                                                </Flex>
                                            ))
                                        }
                                    </Stack>
                                </Flex>
                            )
                        })
                    }
                </Stack>
            </Flex>
        </>
    )

}

export default UserSection;
