import React, { useRef } from "react";
import Draggable from "react-draggable";
import { Flex } from "@chakra-ui/react";
import { Player } from '@livepeer/react';

const Video = ({playbackId, title="Live Stream"}) => {

    const dragRef = useRef(null);

    return (
        <Draggable nodeRef={dragRef} bounds="parent">
          <Flex ref={dragRef} direction="column" borderRadius="12px" zIndex="10" width='300px' position="absolute">
            <Flex h="10px" backgroundColor="white" width='100%' color="black" mb={4} cursor="move">::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::</Flex>
            <Player
                title={title}
                playbackId={playbackId}
                autoPlay
                theme={{
                  borderStyles: {
                    containerBorderStyle: 'hidden',
                  },
                  colors: {
                    accent: '#0069a5',
                  },
                  space: {
                    controlsBottomMarginX: '10px',
                    controlsBottomMarginY: '5px',
                    controlsTopMarginX: '15px',
                    controlsTopMarginY: '10px',
                  },
                  radii: {
                    containerBorderRadius: '10px',
                  },
                }}
                showLoadingSpinner={true}
                refetchPlaybackInfoInterval={1000}
              />
          </Flex>
        </Draggable>
    )
  }

export default Video;
