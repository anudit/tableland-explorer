import React from "react";
import { useMediaQuery, Box, Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import Balancer from 'react-wrap-balancer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from "swiper";
import 'swiper/css';
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";


export default function DiscoverCarousel({projects: slides}){

  const [isLargerThanMd] = useMediaQuery('(min-width: 1280px)')

  return (
    <Flex
      w="full"
      py={10}
      alignItems="center"
      justifyContent="center"
      mt={8}
    >
      <Flex w="full" pos="relative" overflow="hidden">
      <Swiper effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={isLargerThanMd ? 3 : 1}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        index
        pagination={true}
        modules={[EffectCoverflow, Pagination]} 
        style={{
          paddingTop: '50px',
          paddingBottom: '50px'
        }}
       >
        {
            slides.slice(0).sort((a, b)=>{
              return a?.name.toLowerCase().charCodeAt(0) - b?.name.toLowerCase().charCodeAt(0)
            }).map((slide, sid) => (
              <SwiperSlide key={`slide-${sid}`}>
                <ProjectSlide slide={slide} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Flex>
    </Flex>
  );
}


const ProjectSlide = ({slide}) => {
  const { colorMode } = useColorMode();
  return(
    <Box
      flexDirection="column" w="100%" shadow="md" flex="none" alignItems="center"
      borderRadius='20px' 
      height="auto"
      position='relative'
      overflow="hidden"
      maxWidth="800px"
      _hover={{
        '> img': {
            transform: 'scale(1.1)',
            transition: '0.3s ease'
        }
      }}
    >
      <Image
          src={slide.poster}
          borderRadius='20px'
          alt={`Poster Image`}
      />
      <Flex 
          className='overlay-text'
          h="-webkit-fill-available"
          position="absolute"
          flexDirection='column'
          alignItems='flex-start' 
          justifyContent='space-between'
          top={0}
          w="full"
          background={colorMode === 'light' ? 'none' : 'linear-gradient(#ffffff00, #000000c9 90%)'}
      >
        <Flex direction='column-reverse' alignItems='center' align="center" w="full" h="full" mb={4} color="white">
            <Balancer align="center" >
              <Text fontSize={{base:'sm' ,md:'md'}} width="100%">
              {slide.description}
              </Text>
            </Balancer>
            <Text fontSize={{base:'xl' ,md:'2xl'}} fontWeight={600}>{slide.name}</Text>
        </Flex>
      </Flex>
    </Box>
  )
}