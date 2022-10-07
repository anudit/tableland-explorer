import { truncateAddress } from '@/utils/stringUtils';
import { useClipboard, Tooltip, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getAddress } from "ethers/lib/utils";

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

export async function ensToAddress(ensAddress){
    try {

        let resp = await fetch(`https://api.ensideas.com/ens/resolve/${ensAddress}`).then(r=>r.json());

        if (Boolean(resp?.address) === false){
            return false;
        }
        else {
            return getAddress(resp.address);
        }

    } catch (error) {
        console.log('ensToAddress.error', error)
        return false;
    }
}

const AddressOrEns = ({address, tooltip, ...props}) => {

    let [ens, setEns] = useState(false);
    const { hasCopied, onCopy } = useClipboard(address);

    useEffect(()=>{
        if (address) addressToEns(address).then(res=>{
            if(res) setEns(res)
        })
    }, [address])

    if(tooltip){
        return(
            <Tooltip hasArrow label={hasCopied ? "Copied" : "Copy Address"} placement='bottom'>
                <Text onClick={onCopy} cursor="pointer" ml="4" fontWeight={'medium'} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
                    { ens || truncateAddress(address) }
                </Text>
            </Tooltip>
        )
    }
    else {
        return (<Text cursor="pointer" ml="4" fontWeight={'medium'} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" {...props}>
            { ens || truncateAddress(address) }
        </Text>)
    }
}

export default AddressOrEns;
