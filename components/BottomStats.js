import { EthIcon } from '@/public/icons';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, HStack, Text, useColorMode } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

const BottomStats = ({ props }) => {

    const { colorMode } = useColorMode();
    const [stats, setStats] = useState(false);

    useEffect(() => {
        // getOpenStats().then(e=>{
        //     setStats(e.collection.stats);
        // });
    }, [])

    if (stats) {
        return (
            <Flex
                w="100vw"
                direction="row"
                alignItems='center'
                height="35px"
                position='fixed'
                bottom="0"
                borderTopWidth='1px'
                borderTopColor={colorMode === 'light' ? '#fffc' : '#000c'}
                background={colorMode === 'light' ? '#fffc' : '#000c'}
                backdropFilter='blur(20px)'
                fontSize='lg' fontWeight={600}
                {...props}
            >
                <Marquee
                    gradient={false}
                    pauseOnHover={true}
                    speed={30}
                >
                    <Stat
                        title='Volume (1d)'
                        change={stats?.one_day_change}
                        volume={stats?.one_day_volume.toFixed(2)}
                    />


                    <Stat
                        title='Sales (1d)'
                        volume={stats?.one_day_sales}
                        unit={<></>}
                    />


                    <Stat
                        title='Avg Price (1d)'
                        volume={stats?.one_day_average_price.toFixed(2)}
                    />


                    <Stat
                        title='Volume (7d)'
                        change={stats?.seven_day_change}
                        volume={stats?.seven_day_volume.toFixed(2)}
                    />


                    <Stat
                        title='Sales (7d)'
                        volume={stats?.seven_day_sales}
                        unit={<></>}
                    />


                    <Stat
                        title='Avg Price (7d)'
                        volume={stats?.seven_day_average_price.toFixed(2)}
                    />


                    <Stat
                        title='Volume (30d)'
                        change={stats?.thirty_day_change}
                        volume={stats?.thirty_day_volume.toFixed(2)}
                    />


                    <Stat
                        title='Sales (30d)'
                        volume={stats?.thirty_day_sales}
                        unit={<></>}
                    />


                    <Stat
                        title='Avg Price (30d)'
                        volume={stats?.thirty_day_average_price.toFixed(2)}
                    />
                </Marquee>
            </Flex>
        )
    }
}

const Stat = ({ title, volume, change, unit = (<EthIcon mb={1} />) }) => {
    return (
        <HStack mx={2} direction="row" spacing='12px'>
            <Text fontWeight={700}>
                {title}:
            </Text>
            <Text>
                {volume}{unit}
            </Text>
            {
                change && (change >= 0 ? (
                    <Text>
                        <TriangleUpIcon color='green' mb={1} /> {change.toFixed(2)}{unit}
                    </Text>
                ) : (
                    <Text>
                        <TriangleDownIcon color='red' mb={1} /> {change.toFixed(2)}{unit}
                    </Text>
                ))
            }
            <Text mx={1} fontSize="xs">■</Text>
        </HStack >
    )
}

export default BottomStats;
