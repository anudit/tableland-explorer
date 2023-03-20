import React, { createContext, useContext, useState } from "react";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { MotionBox, MotionText } from "./motion";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001
};

const MenuContext = createContext(null);

const useMenu = () => useContext(MenuContext);

export const MotionMenuItem = ({ item, children }) => {
  const menu = useMenu();
  const { colorMode } = useColorMode();

  return (
    <Box
      pos="relative"
      onMouseEnter={() => {
        menu.setActiveItem(item);
      }}
      zIndex="101"
    >
      <MotionText
        // animate={{
        //   color:
        //     menu.activeItem === item
        //       ? "rgba(255,255,255, 1)"
        //       : "rgba(255,255,255, 0.5)"
        // }}
        // transition={{ duration: 0.25 }}
        cursor="pointer"
        color={colorMode === 'dark' ? "rgba(255,255,255, 0.5)" : 'rgba(0,0,0, 0.5)'}
      >
        {item}
      </MotionText>
      {menu.activeItem !== null && (
        <MotionBox
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
        >
          {menu.activeItem === item && (
            <Box
              pos="absolute"
              top="calc(100% + 1rem)"
              left="50%"
              transform="translateX(-50%)"
            >
              <MotionBox
                layoutId="active"
                backgroundColor={colorMode === 'dark' ? "black" : 'white'}
                rounded="2xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                transition={transition}
              >
                <MotionBox layout w="max-content" h="100%" p={4}>
                  {children}
                </MotionBox>
              </MotionBox>
            </Box>
          )}
        </MotionBox>
      )}
    </Box>
  );
};

export const MotionMenu = ({ children }) => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <MenuContext.Provider value={{ activeItem, setActiveItem }}>
      <Flex
        as="nav"
        display="inline-flex"
        p={8}
        gap={8}
        onMouseLeave={() => setActiveItem(null)}
      >
        {children}
      </Flex>
    </MenuContext.Provider>
  );
};
