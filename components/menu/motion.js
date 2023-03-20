import React from "react";
import { motion, isValidMotionProp } from "framer-motion";
import { Text } from "@chakra-ui/react";
import { forwardRef, chakra } from "@chakra-ui/react";

export const MotionBox = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    );
    return <chakra.div ref={ref} {...chakraProps} />;
  })
);

export const MotionText = motion(Text);
