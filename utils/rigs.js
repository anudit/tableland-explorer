import { isAddress } from "ethers/lib/utils";
import { sleep } from "./stringUtils";

const ethereumRpcUrl = 'https://eth.llamarpc.com/rpc/01GN04VPE4RTRF8NH87ZP86K24';

export function constructTokenURIQuery(tokenId = 1){
    return `https://tableland.network/api/v1/query?mode=objects&statement=select%20json_object('name'%2C%20case%20when%20exists%20(select%20*%20from%20pilot_sessions_1_7%20where%20rig_id%20%3D%20result.rig_id%20and%20end_time%20is%20null)%20then%20'Rig%20%23'%20%7C%7C%20rig_id%20%7C%7C%20'%20%E2%9C%88%EF%B8%8F'%20else%20'Rig%20%23'%20%7C%7C%20rig_id%20end%2C%20'external_url'%2C%20'https%3A%2F%2Fgarage.tableland.xyz%2Frigs%2F'%20%7C%7C%20rig_id%2C%20'image'%2C%20'ipfs%3A%2F%2F'%20%7C%7C%20renders_cid%20%7C%7C%20'%2F'%20%7C%7C%20rig_id%20%7C%7C%20'%2F'%20%7C%7C%20image_full_name%2C%20'image_alpha'%2C%20'ipfs%3A%2F%2F'%20%7C%7C%20renders_cid%20%7C%7C%20'%2F'%20%7C%7C%20rig_id%20%7C%7C%20'%2F'%20%7C%7C%20image_full_alpha_name%2C%20'image_medium'%2C%20'ipfs%3A%2F%2F'%20%7C%7C%20renders_cid%20%7C%7C%20'%2F'%20%7C%7C%20rig_id%20%7C%7C%20'%2F'%20%7C%7C%20image_medium_name%2C%20'image_medium_alpha'%2C%20'ipfs%3A%2F%2F'%20%7C%7C%20renders_cid%20%7C%7C%20'%2F'%20%7C%7C%20rig_id%20%7C%7C%20'%2F'%20%7C%7C%20image_medium_alpha_name%2C%20'thumb'%2C%20'ipfs%3A%2F%2F'%20%7C%7C%20renders_cid%20%7C%7C%20'%2F'%20%7C%7C%20rig_id%20%7C%7C%20'%2F'%20%7C%7C%20image_thumb_name%2C%20'thumb_alpha'%2C%20'ipfs%3A%2F%2F'%20%7C%7C%20renders_cid%20%7C%7C%20'%2F'%20%7C%7C%20rig_id%20%7C%7C%20'%2F'%20%7C%7C%20image_thumb_alpha_name%2C%20'animation_url'%2C%20animation_base_url%20%7C%7C%20rig_id%20%7C%7C%20'.html'%2C%20'attributes'%2C%20json_group_array(json_object('display_type'%2C%20display_type%2C%20'trait_type'%2C%20trait_type%2C%20'value'%2C%20value)))%20from%20(select%20*%20from%20rig_attributes_42161_15%20union%20select%20a.rig_id%2C%20'string'%20as%20display_type%2C%20'Garage%20Status'%20as%20trait_type%2C%20case%20when%20start_time%20is%20null%20then%20'parked'%20else%20'in-flight'%20end%20as%20value%20from%20rig_attributes_42161_15%20as%20a%20left%20join%20(select%20*%20from%20pilot_sessions_1_7%20where%20end_time%20is%20null)%20as%20s%20on%20a.rig_id%20%3D%20s.rig_id)%20as%20result%20join%20lookups_42161_10%20where%20rig_id%20%3D%20${tokenId}%20group%20by%20rig_id`
}

export async function garageStatsQuery(){

    let data = await fetch("https://tableland.network/api/v1/query?mode=objects&statement=select%20(select%20count(distinct%20(rig_id))%20from%20rig_attributes_42161_15)%20as%20numRigs%2C%20(select%20count(*)%20from%20(select%20distinct%20(rig_id)%20from%20pilot_sessions_1_7%20where%20end_time%20is%20null))%20as%20numRigsInFlight%2C%20(select%20count(*)%20from%20(select%20distinct%20pilot_contract%2C%20pilot_id%20from%20pilot_sessions_1_7))%20as%20numPilots%2C%20(select%20coalesce(sum(coalesce(end_time%2C%20block_num(1))%20-%20start_time)%2C%200)%20from%20pilot_sessions_1_7)%20as%20totalFlightTime%2C%20(select%20coalesce(avg(coalesce(end_time%2C%20block_num(1))%20-%20start_time)%2C%200)%20from%20pilot_sessions_1_7)%20as%20avgFlightTime%20from%20rig_attributes_42161_15%20limit%201&format=objects");
    let json = await data.json();
    return json[0];
}

export async function getMetadata(tokenIds = []){
    let queryUrl = constructTokenURIQuery(tokenIds);
    let data = await fetch(queryUrl).then(e=>e.json());
    return data;
}

export async function getFlightData(tokenId = 1){

    try {
        let blkNumber = await fetch(ethereumRpcUrl, {
            "headers": {
              "accept": "*/*",
              "content-type": "application/json",
            },
            "body": "{\"method\":\"eth_blockNumber\",\"params\":[],\"id\":42,\"jsonrpc\":\"2.0\"}",
            "method": "POST",
        }).then(r=>r.json());
        blkNumber = parseInt(blkNumber['result']);
    
        let query = `select * from pilot_sessions_1_7 where rig_id = ${tokenId}`
    
        let resp = await fetch(`https://tableland.network/api/v1/query?mode=objects&statement=${encodeURIComponent(query)}`).then(r=>r.json());
    
    
        if (resp?.message){
            return {flightData: false, latestBlock: blkNumber, nftMetadatas: []};
        }
        else {
            let metReq = resp.filter(e=>e.pilot_contract!=null).map(e=>{
                return {
                    'contractAddress': e.pilot_contract,
                    'tokenId': e.id,
                    'tokenType': "ERC721",  
                }
            })
        
            let nftMetadatas = await getNFTMetadataBatch(metReq);
            let fd = {flightData: resp, nftMetadatas, latestBlock: blkNumber};
            return fd;
    
        }
        
    } catch (error) {
        return {flightData: false, latestBlock: 0, nftMetadatas: []};
    }


}

export async function getReservoirData(tokenId, metadataRefresh=false){
    let res = await fetch(`https://api.reservoir.tools/tokens/v5?tokens=0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d:${tokenId}&sortBy=floorAskPrice&limit=20&includeTopBid=true&includeAttributes=true&includeQuantity=true&includeDynamicPricing=true&normalizeRoyalties=true`, {
        method: "GET",
        headers: {
            "x-api-key": Buffer.from('ZDk3YjU4NGUtMjNlYS01ZjQ1LWFiMDEtNzdmM2UwMGQ3YTUw', 'base64')
        }
    });

    if (metadataRefresh === true){
        await fetch("https://api.reservoir.tools/tokens/refresh/v1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.6",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-api-key": Buffer.from('ZDk3YjU4NGUtMjNlYS01ZjQ1LWFiMDEtNzdmM2UwMGQ3YTUw', 'base64')
            },
            "referrer": "https://www.reservoir.market/0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d/956",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                "token": `0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d:${tokenId}`
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(r=>r.json()).catch(console.log);
    }

    if (res.status === 200) {
        res = await res.json()
        return res['tokens'][0];
    }
    else {
        await sleep(5000);
        return await getReservoirData(tokenId);
    }
}

export async function getOpenStats(){

    const options = {method: 'GET', headers: {'X-API-KEY': Buffer.from('OTYwNDFlMWQxZDRiNGYyZmJlMjZiZDdkZTFiZjcxODU=', 'base64')}};
    let res = await fetch(`https://api.opensea.io/api/v1/collection/tableland-rigs`, options).then(response => response.json());
    return res;
}

export async function getVerbwireStats(){

}

export async function verbwireSearch(){

}


export async function getUserRigs(address){
    let userRigs = await fetch(`https://api.nftport.xyz/v0/accounts/${address}?chain=ethereum&contract_address=0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d`,{
        headers: { 'Authorization': 'ad985098-7dbb-4bee-9f7d-ffa06d5a44d9' }
    }).then(e=>e.json());


    if (userRigs?.nfts?.length > 0){
        let userRigsData = userRigs?.nfts?.map(e=>({...e, thumb_alpha: `https://tableland.mypinata.cloud/ipfs/bafybeidpnfh2zc6esvou3kfhhvxmy2qrmngrqczj7adnuygjsh3ulrrfeu/${e.token_id}/image_thumb.png`}))

        // let userRigsData = await getMetadata(userRigs?.nfts?.map(e=>parseInt(e?.token_id)));

        return [
            userRigsData].flat();
    }
    else {
        return [];
    }

}

export async function getNFTMetadataBatch(tokens){
    if (tokens.length >= 1){
        let data = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/jz1AlVEXLDxlzNMcKDg9To03aBnOssyH/getNFTMetadataBatch`, {
            method: "POST",
            body: JSON.stringify({
                tokens
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let resp = await data.json();
        return resp;
    }
    else {
        return [];
    }
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

export async function getFeed(address){
    let data = await fetch(`https://api.nftport.xyz/v0/transactions/accounts/${address}?chain=ethereum&type=mint&type=buy&type=sell&type=transfer_to`, {
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
    }).then(e=>e.json()).catch(e=>{
        return false;
    });
    return data;
}


export async function getProjects(){

    let query = `SELECT * FROM tableverse_5_5_1375`;

    let resp = await fetch(`https://testnets.tableland.network/api/v1/query?mode=objects&statement=${encodeURIComponent(query)}`).then(r=>r.json());

    return resp;
}

export function isTablescanSupporter(address){
    if(isAddress(address)){
        const supporters = ['0xCdD27fDF1B991E9DEB8647EE3D8Ac1bdB7D6b675', '0x3C8a3FC1DA41295888E83656a6f1Bbb11C1DBb8c', '0xE8e5ec9A6508585cCEf8151FeDeda8421867D00d', '0x2415BD3A3d9172B7fe36C8F80B7e8B0991EdE1DD', '0xe3D73DAaE939518c3853e0E8e532ae707cC1A436', '0xe0E4826Ab397d77a68F902e094Bce1046566908c', '0x84F5EaAB08Ef8f0C48B58f8586B1e66f39fa0f0B', '0xE5b1918D99f9B5b63817F6C9A7afdA744eF1F647', '0x6834777560485fc47CDDBf68df6868bc05955422', '0xe4ec13946CE37ae7b3EA6AAC315B486DAD7766F2', '0x50c5a953c4c1E3B3C64999f9E4F123B56D1e3F33', '0xEED42093B7BbaEc078B48582a416c00eD29Aa9a6', '0xA2Fa6144168751D116336B58C5288feaF8bb12C1', '0xcA968044EffFf14Bee263CA6Af3b9823f1968f37', '0x5fd3D9BEa09936979fE3C1C26Aa307b00F575C58', '0x5AdCCAc4f36B095fFb0AA8F43F59F39F52EE7FB3', '0x98b69D0B81fb1966eBe0Af76789425706e5aFe7B', '0xDD8A5674ecA6F1367bD0398D4b931d5B351C0be6', '0xf4b8b9232FDcCdA76EC9285a91eCa9892ed9bB15', '0xF6964535DF39BB8e4C091B6B1Bf871E6C4703859', '0x831962f46CBC9DA96919B1faea3e1Cd29628FB21', '0xFb5E7dD9aF5CaaFD03443A4C4a164859c496D00b', '0x28Bf85fAf0469455710E5Cce867307D5F753532c', '0x14f86E724491feBEB35E49B27F2cfD3337f59Bf2', '0x506adE0A94949dB63047346D3796A01C09384198']
        return supporters.map(e=>e.toLowerCase()).includes(address.toLowerCase())
    }
    else {
        return false;
    }
}