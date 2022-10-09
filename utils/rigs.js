export function constructTokenURIQuery(tokenIds = []){
    return "https://testnet.tableland.network/query?mode=list&s="+encodeURIComponent(`select json_object('name','Rig #'||id,'external_url','https://tableland.xyz/rigs/'||id,'image',image,'image_alpha',image_alpha,'thumb',thumb,'thumb_alpha',thumb_alpha,'attributes',json_group_array(json_object('display_type',display_type,'trait_type',trait_type,'value',value))) from rigs_5_28 join rig_attributes_5_27 on rigs_5_28.id=rig_attributes_5_27.rig_id where id in (${tokenIds.toString()}) group by id;`)
}

export async function getMetadata(tokenIds = []){
    let queryUrl = constructTokenURIQuery(tokenIds);
    let data = await fetch(queryUrl).then(e=>e.json());
    return data;
}

export async function getUserRigs(address){
    let userRigs = await fetch(`https://api.nftport.xyz/v0/accounts/${address}`,{
        headers: {
            'Authorization': 'ad985098-7dbb-4bee-9f7d-ffa06d5a44d9'
        }
    }).then(e=>e.json());

    if (userRigs?.nfts?.length > 0){
        let userRigsData = await getMetadata(userRigs?.nfts?.map(e=>parseInt(e?.token_id)));
        return userRigsData;
    }
    else {
        return [];
    }

}

export async function getRigOwner(tokenId){
    let owner = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/demo/getOwnersForToken?contractAddress=0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d&tokenId=${tokenId}`).then(e=>e.json());
    let ret = owner?.owners[0];
    return ret;

}
