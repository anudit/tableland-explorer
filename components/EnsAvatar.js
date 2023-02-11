import { Avatar } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { EnsCacheContext } from '@/contexts/EnsCache';
import { avatar, getImageDataURL } from '@/utils/stringUtils';
import { isTablescanSupporter } from '@/utils/rigs';

const EnsAvatar = ({address, ...props}) => {

    let [link, setLink] = useState(getImageDataURL(avatar(address)));
    const { getEnsData } = useContext(EnsCacheContext);

    useEffect(()=>{
        if (isAddress(address)) getEnsData(address).then(res=>{
            if(res && Boolean(res?.avatar)) {
                if (res.avatar.includes('ipfs://')) setLink('https://ipfs.io/ipfs/' + res.avatar.replace('ipfs://',''));
                else setLink(res?.avatar)
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    return (
        <Avatar
            p="2px"
            size="sm"
            src={link}
            title={address}
            name={address ? address.slice(2) : "0x"}
            alt="Avatar"
            {...props}
            borderWidth={isTablescanSupporter(address) ? '3px': 'none'}
            borderColor={isTablescanSupporter(address) ? 'gold !important': 'none'}
        />
    )
}

export default EnsAvatar;
