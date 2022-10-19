import React from 'react';
import { Box, Skeleton, useColorMode, AvatarGroup, IconButton, Avatar, Text, Flex, Button } from "@chakra-ui/react";
import { InfoOutlineIcon } from '@chakra-ui/icons';
import EnsAvatar from './EnsAvatar';

const TableCardSkeleton = (props) => {

    const { colorMode } = useColorMode()

    return (
        <Flex
            direction='column'
            borderRadius={{base: 0, md: 20}}
            borderWidth={1}
            w={{base: '100%', md:'600px'}}
            h={{base: 'calc(100vh - 100px)', md:'auto'}}
            mb={{base: 0, md: 0}}
            borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
            {...props}
        >
            <Flex direction='row' p={3} justifyContent="space-between" alignItems='center'>
                <Flex direction='row' align="center" ml={2}>
                    <Skeleton>
                        <AvatarGroup>
                            <EnsAvatar size="sm" address={'0x0'}/>
                            <Avatar size="sm" title={'Skeleton'} />
                        </AvatarGroup>
                    </Skeleton>
                    <Flex direction='column' ml={2}>
                        <Skeleton>
                            <Text>0x00</Text>
                        </Skeleton>
                        <Skeleton>
                            <Text ml={4}  fontSize='sm' color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
                                Created
                            </Text>
                        </Skeleton>
                    </Flex>
                </Flex>
                <Skeleton>
                    <IconButton icon={<InfoOutlineIcon />} variant='ghost' borderRadius='100%'/>
                </Skeleton>
            </Flex>
            <Flex alignItems='center' h="100%">
                <Box height={600} width={600}>
                </Box>
            </Flex>
            <Flex direction='row' m={4} alignItems='center' justifyContent='space-between'>
                <Skeleton>
                    <Flex direction='row' alignItems='center'>
                        <Text fontSize='lg' fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">Skeleton</Text>
                        <Text size='sm'  ml={2} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>#</Text>
                    </Flex>
                </Skeleton>
                <Skeleton>
                    <Button size='sm' borderRadius="100px" colorScheme='blue'>Explore Table</Button>
                </Skeleton>
            </Flex>
        </Flex>
    )
}

export default TableCardSkeleton;
