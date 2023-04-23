import { Contract, ethers } from "ethers";
import { networkDeets, tablelandAbi } from "./stringUtils";

export const fetcher = async (url, method="GET", bodyData = {}) => {
    let res;
    if (method === "GET"){
        res = await fetch(url, {
            method: "GET",
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: "same-origin",
        });
    }
    else if (method === "POST" || method === "DELETE") {
        res = await fetch(url, {
            method,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: "same-origin",
            body: JSON.stringify(bodyData)
        });
    }

    let respData = await res.json();
    return respData;
};

export const fetcherRpc = async (chainId, url, ops = {}) => {

    let query = JSON.parse(ops.body)['query'];

    let provider = new ethers.providers.JsonRpcProvider(networkDeets[chainId].rpc);
    let contract = new Contract(networkDeets[chainId].contractAddress, tablelandAbi, provider);

    if (query.includes('tables(first: 1, orderBy: created, orderDirection: desc)')){
        let res = await contract.totalSupply();
        return {
            data: {
                tables : [
                    {
                        tableId: res ? parseInt(res.toString()) : 0
                    }
                ]
            }
        }
    }
    else {
        return {
            data: {
                tables : []
            }
        }
    }
};

export const multifetch = async (query) => {

    let options = {
        method: "POST",
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: "same-origin",
        body: JSON.stringify({
            query: query,
            variables: null
        })
    };

    let promiseArray = [
        fetch(networkDeets['1'].subgraph, options),
        fetch(networkDeets['5'].subgraph, options),
        fetch(networkDeets['137'].subgraph, options),
        fetch(networkDeets['80001'].subgraph, options),
        fetch(networkDeets['10'].subgraph, options),
        fetch(networkDeets['420'].subgraph, options),
        fetch(networkDeets['42161'].subgraph, options),
        fetch(networkDeets['421613'].subgraph, options),
        fetch(networkDeets['42170'].subgraph, options),
        fetch(networkDeets['11155111'].subgraph, options),
        fetcherRpc(314, networkDeets['314'].rpc, options),
        fetcherRpc(3141, networkDeets['3141'].rpc, options),
    ];
    let res = await Promise.allSettled(promiseArray);
    let results = [];
    for (let i = 0; i < 10; i++) {
        if (res[i].status === 'fulfilled'){
            const dat = await res[i].value.json();
            results.push(dat);
        }
    }
    for (let i = 10; i < 12; i++) {
        // console.log('res[i]', i, res[i]);
        if (res[i].status === 'fulfilled'){
            results.push(res[i].value);
        }
    }
    // console.log(results);
    return results;
};

export default fetcher;
