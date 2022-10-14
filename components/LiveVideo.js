import React, { useRef } from "react";
import Draggable from "react-draggable";
import { Flex } from "@chakra-ui/react";

const Video = ({src, style}) => {

    const dragRef = useRef(null);

    return (
        <Draggable nodeRef={dragRef} bounds="parent">
          <Flex ref={dragRef} direction="column" borderRadius="12px" zIndex="10" width='300px' position="absolute">
            <Flex h="10px" backgroundColor="white" width='100%' color="black" mb={4} cursor="move">::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::</Flex>

            <iframe
              src={src}
              frameBorder="0"
              allowFullscreen
              allow="autoplay; encrypted-media; picture-in-picture"
              sandbox="allow-scripts"
              style={{
                border: 'none',
                height:"200px",
                width: 'auto',
                ...style
              }}
            />
          </Flex>
        </Draggable>
    )
  }

export default Video;
