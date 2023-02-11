import React, { useContext, useEffect, useState } from 'react';
import { truncateAddress } from '@/utils/stringUtils';
import { useClipboard, Tooltip, Text } from '@chakra-ui/react';
import { EnsCacheContext } from '@/contexts/EnsCache';
import { isAddress } from 'ethers/lib/utils';
import Link from 'next/link';

const AddressOrEns = ({address, tooltip, ...props}) => {

    let [ens, setEns] = useState(false);
    const { hasCopied, onCopy } = useClipboard(address);
    const { addressToEns } = useContext(EnsCacheContext);

    useEffect(()=>{
        if (isAddress(address)) addressToEns(address).then(res=>{
            if(res) setEns(res)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    if(tooltip){
        return(
            <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Address"} placement='bottom'>
                <Link href={`/address/${address}`}>
                    <Text fontFamily={ens ? 'sans-serif' : 'monospace'} fontSize='md' fontWeight={100} title={address} onClick={onCopy} cursor="pointer" ml="4" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
                        { ens || truncateAddress(address) }
                    </Text>
                </Link>
            </Tooltip>
        )
    }
    else {
        return (
            <Link href={`/address/${address}`}>
                <Text fontFamily={ens ? 'sans-serif' : 'monospace'} fontSize='md' fontWeight={100} title={address} cursor="pointer" ml="4" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
                    { ens || truncateAddress(address) }
                </Text>
            </Link>
        )
    }
}

export default AddressOrEns;
