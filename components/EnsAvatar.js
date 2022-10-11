import { Avatar } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { EnsCacheContext } from '@/contexts/EnsCache';

const EnsAvatar = ({address, ...props}) => {

    let [link, setLink] = useState(`https://gradient-avatar.glitch.me/${address}`);
    const { getEnsData } = useContext(EnsCacheContext);

    useEffect(()=>{
        if (isAddress(address)) getEnsData(address).then(res=>{
            if(res && res?.avatar) {
                if (res.avatar.includes('ipfs://')){
                    setLink('https://ipfs.io/ipfs/' + res.avatar.replace('ipfs://',''));
                }
                else{
                    setLink(res?.avatar)
                }
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    return (
        <Avatar
            size="sm"
            src={link}
            title={address}
            {...props}
        />
    )
}

export default EnsAvatar;
