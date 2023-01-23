import { mergeKeyValue, sleep } from "./stringUtils";

const ethereumRpcUrl = 'https://eth.llamarpc.com/rpc/01GN04VPE4RTRF8NH87ZP86K24';

export function constructTokenURIQuery(tokenIds = []){
    return `https://tableland.network/api/v1/query?extract=true&unwrap=true&s=${encodeURIComponent(`select json_object('name','Rig #'||rig_id,'external_url','https://garage.tableland.xyz/rigs/'||rig_id,'image','ipfs://'||renders_cid||'/'||rig_id||'/'||image_full_name,'image_alpha','ipfs://'||renders_cid||'/'||rig_id||'/'||image_full_alpha_name,'image_medium','ipfs://'||renders_cid||'/'||rig_id||'/'||image_medium_name,'image_medium_alpha','ipfs://'||renders_cid||'/'||rig_id||'/'||image_medium_alpha_name,'thumb','ipfs://'||renders_cid||'/'||rig_id||'/'||image_thumb_name,'thumb_alpha','ipfs://'||renders_cid||'/'||rig_id||'/'||image_thumb_alpha_name,'animation_url',animation_base_url||rig_id||'.html','attributes',json_insert((select json_group_array(json_object('display_type',display_type,'trait_type',trait_type,'value',value))from rig_attributes_42161_15 where rig_id=348 group by rig_id),'$[#]',json_object('display_type','string','trait_type','Garage Status','value',coalesce((select coalesce(end_time, 'In-Flight') from pilot_sessions_1_7 where rig_id=348 and end_time is null),'Parked')))) from rig_attributes_42161_15 join lookups_42161_10 where rig_id in (${tokenIds.toString()}) group by rig_id;`)}`
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

        return [userRigsData].flat();
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
