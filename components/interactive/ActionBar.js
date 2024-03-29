import React from "react";
import { useColorModeValue, useColorMode, Text, Tooltip, Flex, IconButton, Spinner, ButtonGroup, useClipboard } from "@chakra-ui/react";
import { RepeatIcon, MoonIcon, SunIcon, CopyIcon, CheckIcon} from "@chakra-ui/icons";
import { CodeIcon, PanelIcon, ShareIcon, SparklesIcon } from "@/public/icons";
import { encodeSqlForUrl } from "@/utils/stringUtils";
import { format } from 'sql-formatter';

export const ActionBar = ({inputValue, sqlError, isLoading, refresh, onOpen, panelDirection, setPanelDirection, setInputValue}) => {

const { hasCopied, onCopy } = useClipboard(inputValue);
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink, setValue: setShareLink } = useClipboard("");

  const togglePanelDirection = () => {
    if (panelDirection === 'horizontal') setPanelDirection('vertical')
    else setPanelDirection('horizontal')
}

  const { colorMode, toggleColorMode } = useColorMode();

    return (
    <Flex w="100%" background={colorMode === 'dark' ? 'black' : 'white'} direction="row" justifyContent="space-between" position="absolute" bottom='0' zIndex={21}>
    <Tooltip hasArrow label={colorMode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"} placement='left'>
      <IconButton variant="ghost" size="sm" onClick={toggleColorMode}  icon={colorMode === 'dark' ? <MoonIcon /> : <SunIcon />} />
    </Tooltip>
    <Text bg={useColorModeValue(sqlError ? 'red.200': 'green.200', sqlError ? 'red.600': 'green.600')} width="100%" size="md" p={1} pl={2} alignItems='center'>
      <span>{sqlError || 'SQL looks good' }</span>
    </Text>
    <ButtonGroup size='sm' isAttached variant='ghost'>
      <Tooltip hasArrow label={isLoading ? "Refreshing Data" : "Refresh Data"} placement='left'>
        <IconButton colorScheme='facebook' onClick={refresh} icon={isLoading ? <Spinner size="xs"/> : <RepeatIcon />} disabled={isLoading}/>
      </Tooltip>
      <Tooltip hasArrow label={"Beautify SQL"} placement='left'>
        <IconButton onClick={()=>{
          setInputValue(format(inputValue, { language: 'mysql'}))
        }} icon={<SparklesIcon />} />
      </Tooltip>
      <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Query"} placement='left'>
        <IconButton onClick={onCopy} icon={hasCopied ? <CheckIcon /> : <CopyIcon />} />
      </Tooltip>
      <Tooltip hasArrow label={"Toggle Panel Direction"} placement='left'>
        <IconButton onClick={togglePanelDirection} icon={<PanelIcon />} />
      </Tooltip>
      <Tooltip hasArrow label={"Copy Code"} placement='left'>
        <IconButton onClick={onOpen} icon={<CodeIcon />} />
      </Tooltip>
      <Tooltip hasArrow label={hasCopiedLink ? "Copied" : "Copy Share Link"} placement='left'>
        <IconButton onClick={()=>{
          const li = `https://tablescan.io/interactive?query=${encodeSqlForUrl(inputValue)}&name=${name || 'New Query'}`;
          setShareLink(li);
          onCopyLink();
        }} icon={hasCopiedLink ? <CheckIcon /> : <ShareIcon />} />
      </Tooltip>
    </ButtonGroup>

  </Flex>)
}
