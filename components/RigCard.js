import React from 'react';
import { Box, useColorMode, Text, Flex, Spinner, Button } from "@chakra-ui/react";
import Link from 'next/link';
import Image from 'next/image';

const loaderProp = ({ src }) => { return src }

const RigCard = ({id, ...props}) => {

    const { colorMode } = useColorMode();

    if (id){
        return (
            <Flex
                direction='column'
                borderRadius={{base: 0, md: 20}}
                w={{base: '100%', md:'500px'}}
                my={{base: 4, md: 2}}
                mx={{base: 1, md: 2}}
                scrollSnapAlign="center"
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
                        }
                    }}
                >
                    <Image
                        src={`https://tableland.mypinata.cloud/ipfs/bafybeidpnfh2zc6esvou3kfhhvxmy2qrmngrqczj7adnuygjsh3ulrrfeu/${id}/image_thumb.png`}
                        height={600}
                        width={600}
                        style={{objectFit:'fill'}}
                        placeholder="blur"
                        loader={loaderProp}
                        onError={(e) => {
                            e.currentTarget.setAttribute('src', 'https://res.cloudinary.com/anudit/image/upload/v1663653643/convo/tableland-thumb.png');
                        }}
                        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwePSwuJDJJQExLR0BGRVBac2JQVW1WRUZkiGVtd3uBgoFOYI2XjH2Wc36BfP/bAEMBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIAIkAiQMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAAAAwQCAQYF/8QAHBABAAMBAQEBAQAAAAAAAAAAAAECAxESMSFB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APZgAAAAAAAAAAAAAAAAAHJ+J9FFvibSQJsy7aWeg+mAAAAAOTPHS7WBr07E9J9NVsBoAAAAAAAZv8TaSfpKXSQKtLPXLSz0H2AAAAAM3nkJ72M1slvcG/TdbJfbdLgupZtNnY+s9gGgAAAZtPIArSUukn6Sk0sBdpZ6zazPoH3wAAcmeQ6xpPIBPrZHpY/ayLSwNe26XS+v0ylgX52U0sgzsqzsCqJ66XWzfQdKvLdpJvIE6Sk0sfpKTSwFWsz6ZtZn0D1AAAE7Scn2kEe0otJVbSj0Avv6ZSSf6ZQFmcqs5R5qs5BVWW+k1kzoC0k3ky0k3kE+spNZU6yj1kCbyz6ZvLPQewAABNspn4m1BDsj0hbrCS8An5+mUhzhlIA/NTmnzhTSAOq2xVsGbE6SbYjQE2so9ZV6o9QT3ljrt5Y6D2oAAJ9VBGkAi1hLeqzSE9oAjy3WrvlutQbpCikF0g+sA1ENCIdAuxGiiyfQEmqPVZqj1BLdhq7APbgAATpBxegJNIItCm8E2gCuNVh3jVYBukHVhisG1gGogS7AkCrJ9FNk+gI9Ueq3VFqCS7Bl2Ae2AAAu5jFwTXJsfcmwMtVZbqBlTalVNqDcOS7AkCrp9FF0+gJNUWq3VFqCW7Dd2Af/2Q=='
                        alt={`Picture of the Rig ${id}`}
                    />
                    <Flex 
                        className='overlay-text' 
                        transition='0.5s ease'
                        h="-webkit-fill-available"
                        position="absolute"
                        flexDirection='row' 
                        px={6}
                        pb={6}
                        alignItems='flex-end' 
                        justifyContent='space-between' 
                        w="100%"
                        top={0}
                        background={colorMode === 'light' ? 'none' : 'linear-gradient(#ffffff00, #000000c9 90%)'}
                    >
                        <Flex direction='row' alignItems='center'>
                            <Text fontSize='2xl' fontWeight={600}>Rig #{id}</Text>
                        </Flex>
                        <Link href={`/rig/${id}`}>
                            <Button size='md' borderRadius="100px" color={colorMode === 'light' ? 'white' : 'black'}
                                backgroundColor={colorMode === 'light' ? 'black' : 'white'}
                                _hover={{
                                    backgroundColor: colorMode === 'light' ? 'black' : 'white'
                                }}>View Rig</Button>
                        </Link>
                    </Flex>
                </Box>
            </Flex>
        )
    }
    else {
        return (<Flex direction='column'>
            <Spinner />
        </Flex>)
    }
}

export default RigCard;
