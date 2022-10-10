import { Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { addressToEns } from './AddressOrEns';

const EnsAvatar = ({address, ...props}) => {

    let [link, setLink] = useState(`https://gradient-avatar.glitch.me/${address}`);

    useEffect(()=>{
        if (address) addressToEns(address).then(res=>{
            if(res && res?.avatar) setLink(res?.avatar)
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
