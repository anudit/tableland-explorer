import { truncateAddress } from '@/utils/stringUtils';
import { useClipboard, Tooltip, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

async function addressToEns(address){
    try {

        let resp = await fetch(`https://api.ensideas.com/ens/resolve/${address.toLowerCase()}`).then(r=>r.json());

        if (Boolean(resp?.name) === false){
            return false;
        }
        else {
            return resp.name;
        }

    } catch (error) {
        console.log('addressToEns.error', error)
        return false;
    }
}


const AddressOrEns = ({address, ...props}) => {

    let [ens, setEns] = useState(false);
    const { hasCopied, onCopy } = useClipboard(address);

    useEffect(()=>{
        if (address) addressToEns(address).then(res=>{
            if(res) setEns(res)
        })
    }, [address])

    return(
        <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Address"} placement='bottom'>
            <Text onClick={onCopy} cursor="pointer" ml="4" fontWeight={'medium'} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
                { ens || truncateAddress(address) }
            </Text>
        </Tooltip>
    )
}

export default AddressOrEns;
