export function constructTokenURIQuery(tokenIds = []){
    return "https://testnet.tableland.network/query?mode=list&s="+encodeURIComponent(`select json_object('name','Rig #'||id,'external_url','https://tableland.xyz/rigs/'||id,'image',image,'image_alpha',image_alpha,'thumb',thumb,'thumb_alpha',thumb_alpha,'attributes',json_group_array(json_object('display_type',display_type,'trait_type',trait_type,'value',value))) from rigs_5_28 join rig_attributes_5_27 on rigs_5_28.id=rig_attributes_5_27.rig_id where id in (${tokenIds.toString()}) group by id;`)
}

export async function getMetadata(tokenIds = []){
    let queryUrl = constructTokenURIQuery(tokenIds);
    let data = await fetch(queryUrl).then(e=>e.json());
    return data;
}

export async function getOpenData(tokenId){

    const options = {method: 'GET', headers: {'X-API-KEY': Buffer.from('OTYwNDFlMWQxZDRiNGYyZmJlMjZiZDdkZTFiZjcxODU=', 'base64')}};
    // let promiseArray = tokenIds.map(id=>fetch(`https://api.opensea.io/api/v1/asset/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${id}/?include_orders=true`, options).then(response => response.json()));
    // let data = await Promise.allSettled(promiseArray);
    // return data.map(e=>e.value);

    let res = await fetch(`https://api.opensea.io/api/v1/asset/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${tokenId}/?include_orders=true`, options).then(response => response.json());
    return res;
}

export async function getOpenStats(){

    const options = {method: 'GET', headers: {'X-API-KEY': Buffer.from('OTYwNDFlMWQxZDRiNGYyZmJlMjZiZDdkZTFiZjcxODU=', 'base64')}};
    let res = await fetch(`https://api.opensea.io/api/v1/collection/tableland-rigs`, options).then(response => response.json());
    return res;
}

export async function getUserRigs(address){
    let userRigs = await fetch(`https://api.nftport.xyz/v0/accounts/${address}?chain=ethereum&contract_address=0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d`,{
        headers: { 'Authorization': 'ad985098-7dbb-4bee-9f7d-ffa06d5a44d9' }
    }).then(e=>e.json());


    if (userRigs?.nfts?.length > 0){
        let userRigsData = userRigs?.nfts?.map(e=>({...e, thumb_alpha: `https://bafybeib3bbctx2gpuzicibprsa3h3zbusogxplccnlgbtmargfnh7bcria.ipfs.dweb.link/${e.token_id}/thumb.png`}))

        // let userRigsData = await getMetadata(userRigs?.nfts?.map(e=>parseInt(e?.token_id)));

        return [userRigsData].flat();
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

export async function getRigTxns(tokenId){
    let data = await fetch(`https://api.nftport.xyz/v0/transactions/nfts/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/${tokenId}?chain=ethereum&type=all`, {
        method: 'GET',
        headers: {'Authorization' : 'ad985098-7dbb-4bee-9f7d-ffa06d5a44d9'}
    }).then(e=>e.json());
    return data?.transactions;
}

export async function getLatestRigActions(){
    let data = await fetch(`https://api.nftport.xyz/v0/transactions/nfts/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d?chain=ethereum&type=sale`, {
        method: 'GET',
        headers: {'Authorization' : 'ad985098-7dbb-4bee-9f7d-ffa06d5a44d9'}
    }).then(e=>e.json());
    return data?.transactions;
}

export async function getTsRanking(tokenIds = []){
    let data = await fetch(`https://proxy.cors.sh/https://api.traitsniper.com/v1/collections/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/ranks?page=1&limit=200&token_ids=${tokenIds.toString()}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-ts-api-key': '60a2e208-6adf-4a75-b213-f6a2ec447fba'
        }
    }).then(e=>e.json());
    return data;
}

