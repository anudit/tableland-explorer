import React, { useContext, useEffect, useState } from 'react';
import { truncateAddress } from '@/utils/stringUtils';
import { useClipboard, Tooltip, Text } from '@chakra-ui/react';
import { EnsCacheContext } from '@/contexts/EnsCache';

const AddressOrEns = ({address, tooltip, ...props}) => {

    let [ens, setEns] = useState(false);
    const { hasCopied, onCopy } = useClipboard(address);
    const { addressToEns } = useContext(EnsCacheContext);

    useEffect(()=>{
        if (address) addressToEns(address).then(res=>{
            if(res) setEns(res)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    if(tooltip){
        return(
            <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Address"} placement='bottom'>
                <Text fontFamily='monospace' fontSize='md' fontWeight={100} title={address} onClick={onCopy} cursor="pointer" ml="4" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
                    { ens || truncateAddress(address) }
                </Text>
            </Tooltip>
        )
    }
    else {
        return (<Text fontFamily='monospace' fontSize='md' fontWeight={100} title={address} cursor="pointer" ml="4" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
            { ens || truncateAddress(address) }
        </Text>)
    }
}

export default AddressOrEns;
