import React, { useState } from "react";
import { Tooltip, Flex, IconButton, Spinner, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { CodeIcon } from "@/public/icons";
import { CheckIcon } from "@chakra-ui/icons";
import { LinkIcon } from "@chakra-ui/icons";
import { CopyIcon } from "@chakra-ui/icons";
import SqlInput from "./RunSql";

const NavBar = ({refresh, isLoading, onOpen, inputValue, setInputValue}) => {

  const { hasCopied, onCopy } = useClipboard(global?.window ? Object.fromEntries(new URLSearchParams(window.location.search))?.query : "");
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard(global?.window? window.location.href : '');
  const [sqlError, setSqlError] = useState(false);


  return (
    <Flex
      as="nav"
      justify={{base:null, md:"space-between"}}
      alignItems='center'
      w="100%"
      py={2}
      px={4}
      // background={useColorModeValue('#fcfcfcdb', '#0000005e')}
      // backdropFilter='blur(20px)'
      height="50px"
    >
      <Tooltip placement="bottom" hasArrow label={sqlError || 'SQL looks good.' } bg={sqlError? 'red' : 'green.300'}>
        <Flex w="100%">
          <SqlInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            sqlError={sqlError} setSqlError={setSqlError} size="sm" mt={2}
          />
        </Flex>
      </Tooltip>
      <Flex direction="row" justify="right" alignItems='center' w="fit-content" align='right'>
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
            <IconButton onClick={onCopyLink} icon={hasCopiedLink ? <CheckIcon /> : <LinkIcon />} />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default NavBar;
