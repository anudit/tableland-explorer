import React, { useState, createContext } from "react";
import { getAddress } from "ethers/lib/utils";

export const EnsCacheContext = createContext(undefined);

export const EnsCacheProvider = ({children}) => {

    let [cache, setCache] = useState({});

    async function getEnsData(addressOrEns){
        try {

            if (Object.keys(cache).includes(addressOrEns.toLowerCase()) === true){
                // console.log('using cache', addressOrEns) // Enable to see the pref improvements
                return cache[addressOrEns];
            }
            else {
                let resp = await fetch(`https://api.ensideas.com/ens/resolve/${addressOrEns.toLowerCase()}`).then(r=>r.json());
                setCache(e=>{
                    let data = e;
                    data[resp?.address.toLowerCase()] = resp;
                    if (resp?.name != null){
                        data[resp?.name.toLowerCase()] = resp;
                    }
                    return data;
                })
                return resp;
            }

        } catch (error) {
            console.log('getEnsData.error', error)
            return false;
        }
    }

    async function addressToEns(address){
        let resp = await getEnsData(address);

        if (Boolean(resp?.name) === false){
            return false;
        }
        else {
            return resp.name;
        }
    }

    async function ensToAddress(ensAddress){
        let resp = await getEnsData(ensAddress);

        if (Boolean(resp?.address) === false){
            return false;
        }
        else {
            return getAddress(resp.address);
        }
    }

    async function lensToAddress(lensHandle){
        let resp = await fetch(`https://api.thegraph.com/subgraphs/name/anudit/lens-protocol`, {
            method: 'POST',
            body: JSON.stringify({
                query: `
                {
                    profiles(where: {handle: "${lensHandle}"}) {
                      id
                      owner
                      handle
                    }
                  }
                `,
                variables: {}
            })
        }).then(r=>r.json());

        if (!resp?.data?.profiles?.length){
            return false;
        }
        else {
            console.log(resp, resp?.data?.profiles[0].owner)
            return getAddress(resp?.data?.profiles[0].owner);
        }
    }

    return (
        <EnsCacheContext.Provider value={{
            getEnsData,
            addressToEns,
            ensToAddress,
            lensToAddress
          }}>
              {children}
        </EnsCacheContext.Provider>
    )
}
