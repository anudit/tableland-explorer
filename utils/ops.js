import { multifetch } from "./fetcher";

export const getLikes  = async (fullTableName) => {
    let data = await fetch('https://api.thegraph.com/subgraphs/name/anudit/tablescan-contracts', {
        method: "POST",
        body: JSON.stringify({
            query: `{
                tables(where: {fullTableName: "${fullTableName}"}) {
                  likes {
                    address
                    timestamp
                  }
                }
            }`
        })
    });
    let resp = await data.json();
    return resp?.data?.tables.length > 0 ? resp?.data?.tables[0]?.likes : [];
}

export const getUserLikes  = async (address) => {
  let data = await fetch('https://api.thegraph.com/subgraphs/name/anudit/tablescan-contracts', {
      method: "POST",
      body: JSON.stringify({
          query: `{
            likes(where: {address: "${address.toLowerCase()}"}) {
                id
                address
                timestamp
                tableName {
                  fullTableName
                }
              }
          }`
      })
  });
  let resp = await data.json();

  if (resp?.data?.likes.length > 0) {
    let requiredNames = resp?.data?.likes.map((e)=>e?.tableName?.fullTableName);
    let multiResp = await multifetch(`{
      tables(where: {name_in: ${JSON.stringify(requiredNames)}}, orderBy: created, orderDirection: desc) {
          id
          name
          owner {
              id
          }
          tableId
          statement
          tokenURI
          created
          lastUpdated
          txnHash
          controller {
              id
          }
          historyCount
      }
    }`);

    return multiResp.map(e=>e?.data?.tables).flat();

  }
  else {
    return []
  }
}