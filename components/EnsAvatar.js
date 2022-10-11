import { Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';

const EnsAvatar = ({address, ...props}) => {

    let [link, setLink] = useState(`https://gradient-avatar.glitch.me/${address}`);

    useEffect(()=>{
        if (isAddress(address)) fetch(`https://api.ensideas.com/ens/resolve/${address}`).then(r=>r.json()).then(res=>{
            if(res && res?.avatar) {
                if (res.avatar.includes('ipfs://')){
                    setLink('https://ipfs.io/ipfs/' + res.avatar.replace('ipfs://',''));
                }
                else{
                    setLink(res?.avatar)
                }
            }
        })
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
