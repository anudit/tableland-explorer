import { isAddress } from "ethers/lib/utils";
import { mergeKeyValue, sleep } from "./stringUtils";

const ethereumRpcUrl = 'https://eth.llamarpc.com/rpc/01GN04VPE4RTRF8NH87ZP86K24';

export function constructTokenURIQuery(tokenId = 1){
    return `https://tableland.network/query?extract=true&unwrap=true&s=select%20json_object('name'%2C'Rig%20%23'%7C%7Crig_id%2C'external_url'%2C'https%3A%2F%2Fgarage.tableland.xyz%2Frigs%2F'%7C%7Crig_id%2C'image'%2C'ipfs%3A%2F%2F'%7C%7Crenders_cid%7C%7C'%2F'%7C%7Crig_id%7C%7C'%2F'%7C%7Cimage_full_name%2C'image_alpha'%2C'ipfs%3A%2F%2F'%7C%7Crenders_cid%7C%7C'%2F'%7C%7Crig_id%7C%7C'%2F'%7C%7Cimage_full_alpha_name%2C'image_medium'%2C'ipfs%3A%2F%2F'%7C%7Crenders_cid%7C%7C'%2F'%7C%7Crig_id%7C%7C'%2F'%7C%7Cimage_medium_name%2C'image_medium_alpha'%2C'ipfs%3A%2F%2F'%7C%7Crenders_cid%7C%7C'%2F'%7C%7Crig_id%7C%7C'%2F'%7C%7Cimage_medium_alpha_name%2C'thumb'%2C'ipfs%3A%2F%2F'%7C%7Crenders_cid%7C%7C'%2F'%7C%7Crig_id%7C%7C'%2F'%7C%7Cimage_thumb_name%2C'thumb_alpha'%2C'ipfs%3A%2F%2F'%7C%7Crenders_cid%7C%7C'%2F'%7C%7Crig_id%7C%7C'%2F'%7C%7Cimage_thumb_alpha_name%2C'animation_url'%2Canimation_base_url%7C%7Crig_id%7C%7C'.html'%2C'attributes'%2Cjson_insert((select%20json_group_array(json_object('display_type'%2Cdisplay_type%2C'trait_type'%2Ctrait_type%2C'value'%2Cvalue))from%20rig_attributes_42161_15%20where%20rig_id%3D${tokenId}%20group%20by%20rig_id)%2C'%24%5B%23%5D'%2Cjson_object('display_type'%2C'string'%2C'trait_type'%2C'Garage%20Status'%2C'value'%2Ccoalesce((select%20coalesce(end_time%2C%20'in-flight')%20from%20pilot_sessions_1_7%20where%20rig_id%3D${tokenId}%20and%20end_time%20is%20null)%2C'parked'))))%20from%20rig_attributes_42161_15%20join%20lookups_42161_10%20where%20rig_id%3D${tokenId}%20group%20by%20rig_id%3B`
}

export async function garageStatsQuery(){
    let blkNumber = await fetch(ethereumRpcUrl, {
        "headers": {
          "accept": "*/*",
          "content-type": "application/json",
        },
        "body": "{\"method\":\"eth_blockNumber\",\"params\":[],\"id\":42,\"jsonrpc\":\"2.0\"}",
        "method": "POST",
    }).then(r=>r.json());
    blkNumber = parseInt(blkNumber['result']);

    let data = await fetch("https://tableland.network/rpc", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.6",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1"
        },
        "referrer": "https://garage.tableland.xyz/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({"jsonrpc":"2.0","method":"tableland_runReadQuery","id":1,"params":[{"statement":`\n  SELECT\n  (\n    SELECT count(distinct(rig_id)) FROM\n    rig_attributes_42161_15\n  ) AS num_rigs,\n  (\n    SELECT count(*) FROM (\n      SELECT DISTINCT(rig_id)\n      FROM pilot_sessions_1_7\n      WHERE end_time IS NULL\n    )\n  ) AS num_rigs_in_flight,\n  (\n    SELECT count(*) FROM (\n      SELECT DISTINCT pilot_contract, pilot_id\n      FROM pilot_sessions_1_7\n    )\n  ) AS num_pilots,\n  (\n    SELECT coalesce(sum(coalesce(end_time, ${blkNumber}) - start_time), 0)\n    FROM pilot_sessions_1_7\n  ) AS total_flight_time,\n  (\n    SELECT coalesce(avg(coalesce(end_time, ${blkNumber}) - start_time), 0)\n    FROM pilot_sessions_1_7\n  ) AS avg_flight_time\n  FROM rig_attributes_42161_15\n  LIMIT 1;`,"output":"table"}]}),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });
    let json = await data.json();
    return mergeKeyValue(json['result']['data']['columns'].map(e=>e['name']), json['result']['data']['rows'][0]);
}

export async function getMetadata(tokenIds = []){
    let queryUrl = constructTokenURIQuery(tokenIds);
    let data = await fetch(queryUrl).then(e=>e.json());
    return data;
}

export async function getFlightData(tokenId = 1){

    let blkNumber = await fetch(ethereumRpcUrl, {
        "headers": {
          "accept": "*/*",
          "content-type": "application/json",
        },
        "body": "{\"method\":\"eth_blockNumber\",\"params\":[],\"id\":42,\"jsonrpc\":\"2.0\"}",
        "method": "POST",
    }).then(r=>r.json());
    blkNumber = parseInt(blkNumber['result']);

    let query = `SELECT
        json_group_array(json_object(
            'contract', pilot_contract,
            'tokenId', cast(pilot_id as text),
            'owner', owner,
            'startTime', start_time,
            'endTime', end_time
        ))
    FROM pilot_sessions_1_7
    WHERE rig_id = ${tokenId}`;

    let resp = await fetch(`https://tableland.network/api/v1/query?extract=true&unwrap=true&s=${encodeURIComponent(query)}`).then(r=>r.json());

    let metReq = resp.filter(e=>e.contract!=null).map(e=>{
        return {
            'contractAddress': e.contract,
            'tokenId': e.tokenId,
            'tokenType': "ERC721",
        }
    })

    let nftMetadatas = await getNFTMetadataBatch(metReq);
    return {flightData: resp, nftMetadatas, latestBlock: blkNumber};
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

    let resp = await fetch(`https://testnets.tableland.network/api/v1/query?mode=json&s=${encodeURIComponent(query)}`).then(r=>r.json());

    return resp;
}

export function isTablescanSupporter(address){
    if(isAddress(address)){
        const supporters = ["0xCdD27fDF1B991E9DEB8647EE3D8Ac1bdB7D6b675","0x3C8a3FC1DA41295888E83656a6f1Bbb11C1DBb8c","0xE8e5ec9A6508585cCEf8151FeDeda8421867D00d","0x2415BD3A3d9172B7fe36C8F80B7e8B0991EdE1DD","0xe3D73DAaE939518c3853e0E8e532ae707cC1A436","0xe0E4826Ab397d77a68F902e094Bce1046566908c","0x84F5EaAB08Ef8f0C48B58f8586B1e66f39fa0f0B","0xE5b1918D99f9B5b63817F6C9A7afdA744eF1F647","0x6834777560485fc47CDDBf68df6868bc05955422","0xe4ec13946CE37ae7b3EA6AAC315B486DAD7766F2","0x50c5a953c4c1E3B3C64999f9E4F123B56D1e3F33","0xEED42093B7BbaEc078B48582a416c00eD29Aa9a6","0xA2Fa6144168751D116336B58C5288feaF8bb12C1","0xcA968044EffFf14Bee263CA6Af3b9823f1968f37","0x5fd3D9BEa09936979fE3C1C26Aa307b00F575C58","0x5AdCCAc4f36B095fFb0AA8F43F59F39F52EE7FB3"]
        return supporters.map(e=>e.toLowerCase()).includes(address.toLowerCase())
    }
    else {
        return false;
    }
}