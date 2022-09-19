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

export const multifetch = async (searchValue) => {

    let options = {
        method: "POST",
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: "same-origin",
        body: JSON.stringify({
            query: `{
                tables(where: {name_contains_nocase: "${searchValue}"}, limit: 100) {
                  name
                  owner
                  tableId
                }
              }`,
            variables: null
        })
    };

    let promiseArray = [
        fetch("https://api.thegraph.com/subgraphs/name/anudit/tableland", options),
        fetch("https://api.thegraph.com/subgraphs/name/anudit/tableland-optimism-goerli", options),
        fetch("https://api.thegraph.com/subgraphs/name/anudit/tableland-arbitrum-goerli", options),
    ];
    let res = await Promise.allSettled(promiseArray);
    let results = [];
    for (let i = 0; i < res.length; i++) {
        if (res[i].status === 'fulfilled'){
            const dat = await res[i].value.json();
            results = results.concat(dat?.data?.tables);
        }
    }
    return results;
};

export default fetcher;
