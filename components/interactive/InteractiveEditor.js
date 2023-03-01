import React from "react";
import { Flex } from "@chakra-ui/react";
import SqlEditor from "../SqlEditor";

const InteractiveEditor = ({inputValue, setInputValue, sqlError, setSqlError}) => {

  return (
    <Flex
      justify={{base:null, md:"space-between"}}
      alignItems='center'
      w="100%"
      h="600px"
      direction="column"
      borderRadius='25px'
    >
      <SqlEditor
        inputValue={inputValue}
        setInputValue={setInputValue}
        sqlError={sqlError} setSqlError={setSqlError} size="sm"
      />
    </Flex>
  );
};

export default InteractiveEditor;
