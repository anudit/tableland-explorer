import React from 'react';
import { useColorMode, Text, Flex, Spinner, Button } from "@chakra-ui/react";
import Link from 'next/link';
import Image from 'next/future/image';

const loaderProp = ({ src }) => { return src }

const RigCard = ({id}) => {

    const { colorMode } = useColorMode();

    if (id){
        return (
            <Flex
                direction='column'
                borderRadius={{base: 0, md: 20}}
                borderWidth={1}
                w={{base: '100%', md:'600px'}}
                h={{base: '90vh', md:'auto'}}
                mb={{base: 0, md: 4}}
                borderColor={colorMode === 'light' ? 'gray.200': 'gray.800'}
                scrollSnapAlign="center"
            >
                <Flex alignItems='center' h="100%">
                    <Image
                        src={`https://bafybeib3bbctx2gpuzicibprsa3h3zbusogxplccnlgbtmargfnh7bcria.ipfs.dweb.link/${id}/thumb.png`}
                        height={600}
                        width={600}
                        style={{objectFit:'fill' }}
                        placeholder="blur"
                        loader={loaderProp}
                        onError={(e) => {
                            e.currentTarget.setAttribute('src', 'https://res.cloudinary.com/anudit/image/upload/v1663653643/convo/tableland-thumb.png');
                        }}
                        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwePSwuJDJJQExLR0BGRVBac2JQVW1WRUZkiGVtd3uBgoFOYI2XjH2Wc36BfP/bAEMBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIAIkAiQMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAAAAwQCAQYF/8QAHBABAAMBAQEBAQAAAAAAAAAAAAECAxESMSFB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APZgAAAAAAAAAAAAAAAAAHJ+J9FFvibSQJsy7aWeg+mAAAAAOTPHS7WBr07E9J9NVsBoAAAAAAAZv8TaSfpKXSQKtLPXLSz0H2AAAAAM3nkJ72M1slvcG/TdbJfbdLgupZtNnY+s9gGgAAAZtPIArSUukn6Sk0sBdpZ6zazPoH3wAAcmeQ6xpPIBPrZHpY/ayLSwNe26XS+v0ylgX52U0sgzsqzsCqJ66XWzfQdKvLdpJvIE6Sk0sfpKTSwFWsz6ZtZn0D1AAAE7Scn2kEe0otJVbSj0Avv6ZSSf6ZQFmcqs5R5qs5BVWW+k1kzoC0k3ky0k3kE+spNZU6yj1kCbyz6ZvLPQewAABNspn4m1BDsj0hbrCS8An5+mUhzhlIA/NTmnzhTSAOq2xVsGbE6SbYjQE2so9ZV6o9QT3ljrt5Y6D2oAAJ9VBGkAi1hLeqzSE9oAjy3WrvlutQbpCikF0g+sA1ENCIdAuxGiiyfQEmqPVZqj1BLdhq7APbgAATpBxegJNIItCm8E2gCuNVh3jVYBukHVhisG1gGogS7AkCrJ9FNk+gI9Ueq3VFqCS7Bl2Ae2AAAu5jFwTXJsfcmwMtVZbqBlTalVNqDcOS7AkCrp9FF0+gJNUWq3VFqCW7Dd2Af/2Q=='
                        alt={`Picture of the Rig ${id}`}
                    />
                </Flex>
                <Flex direction='row' m={4} alignItems='center' justifyContent='space-between'>
                    <Flex direction='row' alignItems='center'>
                        <Text fontSize='lg' fontWeight={600}>Rig #{id}</Text>
                    </Flex>
                    <Link href={`/rig/${id}`}>
                        <Button size='sm' borderRadius="100px" colorScheme='blue'>View Rig</Button>
                    </Link>
                </Flex>
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
