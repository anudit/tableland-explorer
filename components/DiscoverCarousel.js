import React, { useState } from "react";
import { Heading, Box, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react";
import Balancer from 'react-wrap-balancer';

export default function DiscoverCarousel({projects: slides}){
  const arrowStyles = {
    cursor: "pointer",
    pos: "absolute",
    top: "50%",
    w: "auto",
    mt: "-22px",
    p: "16px",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "0.6s ease",
    borderRadius: "0 3px 3px 0",
    userSelect: "none",
    _hover: {
      opacity: 0.8,
      bg: "black",
    },
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesCount = slides.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };
  const nextSlide = () => {slidesCount
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };
  const setSlide = (slide) => {
    setCurrentSlide(slide);
  };
  const carouselStyle = {
    transition: "all .5s",
    ml: `-${currentSlide * 100}%`,
  };

  return (
    <Flex
      w="full"
      py={10}
      alignItems="center"
      justifyContent="center"
      mt={8}
    >
      <Flex w="full" pos="relative" overflow="hidden">
        <Flex h={{base: "500px", md:"600px"}} w="full" {...carouselStyle}>
          {slides.map((slide, sid) => (
            <Flex key={`slide-${sid}`} flexDirection="column" w="100%" shadow="md" flex="none" align="center">
                <Image src={slide.poster} m={10} borderRadius='30px' height={{base: "auto", md:"560px"}} />
              <Stack
                p="8px 12px"
                pos="absolute"
                bottom="24px"
                textAlign="center"
                w="full"
                mb="8"
                color="white"
                alignItems='center'
              >
                <Heading fontSize="4xl">{slide.name}</Heading>
                <Text fontSize="lg" w="80%" align="center">
                    <Balancer>
                        {slide.description}
                    </Balancer>
                </Text>
              </Stack>
            </Flex>
          ))}
        </Flex>
        <Text {...arrowStyles} left="0" onClick={prevSlide}>
          &#10094;
        </Text>
        <Text {...arrowStyles} right="0" onClick={nextSlide}>
          &#10095;
        </Text>
        <HStack justify="center" pos="absolute" bottom="8px" w="full">
          {Array.from({ length: slidesCount }).map((_, slide) => (
            <Box
              key={`dots-${slide}`}
              cursor="pointer"
              boxSize={["7px", null, "15px"]}
              m="0 2px"
              bg={currentSlide === slide ? "blackAlpha.800" : "blackAlpha.500"}
              rounded="50%"
              display="inline-block"
              transition="background-color 0.6s ease"
              _hover={{ bg: "blackAlpha.800" }}
              onClick={() => setSlide(slide)}
            ></Box>
          ))}
        </HStack>
      </Flex>
    </Flex>
  );
}
