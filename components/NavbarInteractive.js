import React, { useState } from "react";
import { Text, Tooltip, Flex, IconButton, Spinner, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { CodeIcon } from "@/public/icons";
import { CheckIcon } from "@chakra-ui/icons";
import { LinkIcon } from "@chakra-ui/icons";
import { CopyIcon } from "@chakra-ui/icons";
import SqlEditor from "./SqlEditor";
import { encodeSqlForUrl } from "@/utils/stringUtils";

const NavBar = ({refresh, isLoading, onOpen, inputValue, setInputValue, name=false}) => {

  const { hasCopied, onCopy } = useClipboard(inputValue);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink, setValue: setShareLink } = useClipboard("");
  const [sqlError, setSqlError] = useState(false);

  return (
    <Flex
      justify={{base:null, md:"space-between"}}
      alignItems='center'
      w="100%"
      // background={useColorModeValue('#fcfcfcdb', '#0000005e')}
      // backdropFilter='blur(20px)'
      height="30vh"
      direction="column"
    >
      <Flex w="100%" id='editor' h="100%">
        <SqlEditor
          inputValue={inputValue}
          setInputValue={setInputValue}
          sqlError={sqlError} setSqlError={setSqlError} size="sm"
        />
      </Flex>
      <Flex  w="100%" direction="row" justifyContent="space-between">
        <Text bg={sqlError? 'red.600' : 'green.600'} width="100%" size="md" p={1} pl={2}>
          {sqlError || 'SQL looks good.' }
        </Text>
        <ButtonGroup size='sm' isAttached variant='ghost'>
          <Tooltip hasArrow label={isLoading ? "Refreshing Data" : "Refresh Data"} placement='left'>
            <IconButton colorScheme='facebook' onClick={refresh} icon={isLoading ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isLoading}/>
          </Tooltip>
          <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Query"} placement='left'>
            <IconButton onClick={onCopy} icon={hasCopied ? <CheckIcon /> : <CopyIcon />} />
          </Tooltip>
          <Tooltip hasArrow label={"Copy Code"} placement='left'>
            <IconButton onClick={onOpen} icon={<CodeIcon />} />
          </Tooltip>
          <Tooltip hasArrow label={hasCopiedLink ? "Copied" : "Copy Share Link"} placement='left'>
            <IconButton onClick={()=>{
              const li = `https://tablescan.io/interactive?query=${encodeSqlForUrl(inputValue)}&name=${name || 'New Query'}`;
              setShareLink(li);
              onCopyLink();
            }} icon={hasCopiedLink ? <CheckIcon /> : <LinkIcon />} />
          </Tooltip>
        </ButtonGroup>

      </Flex>
    </Flex>
  );
};

export default NavBar;
