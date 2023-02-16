import React from 'react';
import { chakra, Box, useColorMode, Text, Flex, Spinner, Button } from "@chakra-ui/react";
import Link from 'next/link';

const RigCard = ({id, ...props}) => {

    const { colorMode } = useColorMode();

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
                        '> iframe': {
                            transform: 'scale(1.1)',
                            transition: '0.5s ease-in-out'
                        },
                        '> div > button': {
                            opacity: 1,
                            transition: '0.5s ease-in-out'
                        },
                    }}
                >
                    <chakra.iframe
                        title={id}
                        src={`https://rigs.tableland.xyz/${id}.html`}
                        width={500}
                        height={500}
                        scrolling="no"
                        allowtransparency="true"
                    />
                    <Flex 
                        className='overlay-text' 
                        transition='0.5s ease'
                        h="-webkit-fill-available"
                        position="absolute"
                        flexDirection='row' 
                        px={6}
                        pb={4}
                        alignItems='flex-end' 
                        justifyContent='space-between' 
                        w="100%"
                        top={0}
                        background={colorMode === 'light' ? 'none' : 'linear-gradient(#ffffff00, #000000c9 95%)'}
                    >
                        <Flex direction='row' alignItems='center'>
                            <Text fontSize='2xl' fontWeight={600}>Rig #{id}</Text>
                        </Flex>
                        <Button opacity={0} size='md' borderRadius="100px" color={colorMode === 'light' ? 'white' : 'black'}
                            backgroundColor={colorMode === 'light' ? 'black' : 'white'}
                            _hover={{
                                backgroundColor: colorMode === 'light' ? 'black' : 'white'
                            }}>View Rig</Button>
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
