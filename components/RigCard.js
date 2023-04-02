import React, { useEffect, useState } from 'react';
import { Box, useColorMode, Text, Flex, Spinner, Button } from "@chakra-ui/react";
import Link from 'next/link';
import Image from 'next/image';
import { getFlightData } from '@/utils/rigs';

const RigCard = ({id, ...props}) => {

    const { colorMode } = useColorMode();
    const [driver, setDriver] = useState(null);

    useEffect(()=>{
        if(driver == null){
            getFlightData(id).then(({flightData, nftMetadatas})=>{
                if (nftMetadatas.length>0){
                    console.log('nftMetadatas', id, nftMetadatas[0]);
                    setDriver({
                        tokenId: nftMetadatas[0]?.id.tokenId,
                        address: nftMetadatas[0]?.contract.address,
                        image: nftMetadatas[0]?.media[0].gateway!= ''? nftMetadatas[0]?.media[0].gateway : nftMetadatas[0]?.media[0].raw != ''? nftMetadatas[0]?.media[0].raw : undefined,
                    })
                }
                else if(flightData.length>0){
                    setDriver({
                        tokenId: false,
                        address: false,
                        image: 'https://res.cloudinary.com/anudit/image/upload/v1680458084/convo/trainer-pilot.0b01d86c.svg',
                    })
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if (id){
        return (
            
            <Link href={`/rig/${id}`}>
            <Flex
                direction='column'
                borderRadius={{base: 0, md: 20}}
                w={{base: '100%', md:'500px'}}
                my={{base: 4, md: 2}}
                mx={{base: 1, md: 2}}
                scrollSnapAlign="center"
                cursor='pointer'
                {...props}
            >
                <Box
                    position='relative'
                    overflow="hidden"
                    borderRadius="30px"
                    _hover={{
                        '> img': {
                            transform: 'scale(1.1)',
                            transition: '0.5s ease-in-out'
                        },
                        '> div > div > button': {
                            opacity: 1,
                            transition: '0.5s ease-in-out'
                        },
                    }}
                >
                    <Image 
                        src={`https://tableland.mypinata.cloud/ipfs/bafybeidpnfh2zc6esvou3kfhhvxmy2qrmngrqczj7adnuygjsh3ulrrfeu/${id}/image_thumb.png`}
                        width={500}
                        height={500}
                        alt="Image of Rig"
                    />
                    <Flex 
                        className='overlay-text' 
                        transition='0.5s ease'
                        h="-webkit-fill-available"
                        position="absolute"
                        flexDirection='column' 
                        px={6}
                        pb={4}
                        justifyContent='space-between' 
                        w="100%"
                        top={0}
                        background={colorMode === 'light' ? 'none' : 'linear-gradient(#ffffff00, #000000c9 95%)'}
                    >
                        <Flex direction='row' justifyContent='flex-end' mt='20px'>
                            {
                                Boolean(driver) && (
                                    <Image 
                                        style={{ borderRadius:"10px" }}
                                        alt="driver"
                                        src={driver.image }
                                        width={100}
                                        height={100}
                                    />
                                )
                            }
                        </Flex>
                        <Flex direction='row' alignItems='center' justifyContent='space-between' >
                            <Flex direction='row' alignItems='center'>
                                <Text fontSize='2xl' fontWeight={600}>Rig #{id}</Text>
                            </Flex>
                            <Button opacity={0} size='md' borderRadius="100px" color={colorMode === 'light' ? 'white' : 'black'}
                                backgroundColor={colorMode === 'light' ? 'black' : 'white'}
                                _hover={{
                                    backgroundColor: colorMode === 'light' ? 'black' : 'white'
                                }}>
                                    View Rig
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
                </Flex>
            </Link>
        )
    }
    else {
        return (<Flex direction='column'>
            <Spinner />
        </Flex>)
    }
}

export default RigCard;
