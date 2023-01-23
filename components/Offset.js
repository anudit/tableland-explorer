import React, { useEffect, useState } from 'react';
import { Stat, StatLabel, StatNumber, StatHelpText, StatGroup, Flex, Button, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, Text, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { prettifyNumber } from '@/utils/stringUtils';
import Link from 'next/link';
import { SeedchainIcon, ToucanIcon } from '@/public/icons';

const Offset = ({ isOpen, onOpen, onClose }) => {

    const [carbon, setCarbon] = useState(false);
    const { address } = useAccount();

    useEffect(()=>{
        if (carbon===false){
            fetch(`/api/offset?address=${address}`).then(e=>e.json()).then(setCarbon)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>🌳 Climate Action</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            carbon === false ? (
                                <Spinner/>
                            ) : (
                                <Flex direction="column">

                                    <StatGroup>
                                        <Stat>
                                            <StatLabel>PoW ({prettifyNumber(carbon['powData']['gas'])} Gas)</StatLabel>
                                            <StatNumber>{(carbon['powData']['impact']).toFixed(3)} TCO<sub>2</sub></StatNumber>
                                            <StatHelpText>
                                                Spent on {carbon['powData']['tx']} Txns
                                            </StatHelpText>
                                        </Stat>

                                        <Stat>
                                            <StatLabel>PoS ({prettifyNumber(carbon['posData']['gas'])} Gas)</StatLabel>
                                            <StatNumber>{(carbon['posData']['impact']).toFixed(3)} TCO<sub>2</sub></StatNumber>
                                            <StatHelpText>
                                                Spent on {carbon['posData']['tx']} Txns
                                            </StatHelpText>
                                        </Stat>
                                    </StatGroup>
                                    <br/>
                                    <StatGroup>
                                        <Stat>
                                            <StatLabel>Total ({prettifyNumber(carbon['powData']['gas'] + carbon['posData']['gas'])} Gas)</StatLabel>
                                            <StatNumber>{(carbon['powData']['impact'] + carbon['posData']['impact']).toFixed(3)} TCO<sub>2</sub></StatNumber>
                                            <StatHelpText>
                                                Spent on {carbon['powData']['tx'] + carbon['posData']['tx']} Txns
                                            </StatHelpText>
                                        </Stat>
                                    </StatGroup>
                                    <Flex direction="column" mt={2}>
                                        <Link href="https://app.toucan.earth/retirements" target='_blank'>
                                            <Button mt={1} colorScheme="green" w="100%" leftIcon={<ToucanIcon/>}>Offset Carbon on Toucan</Button>
                                        </Link>
                                        <Link href="https://www.seedchain.org/mint" target='_blank'>
                                            <Button mt={1} colorScheme="green" w="100%" leftIcon={<SeedchainIcon/>}>Plant Trees on Seedchain</Button>
                                        </Link>
                                    </Flex>
                                    <br/>
                                </Flex>
                            )
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Text onClick={onOpen}>
                Climate Action
            </Text>
        </>
    )
}

export default Offset;
