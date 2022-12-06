export default async function handler(req, res) {
    const { rigId } = req.query;

    if(parseInt(rigId)>0 && parseInt(rigId) <= 3000){

        try {
            var raw = JSON.stringify({
                "filters": {
                  "tokenIds": [
                    rigId
                  ],
                  "address": "0x8eaa9ae1ac89b1c8c8a8104d08c045f78aadb42d"
                },
                "refreshMetadata": false,
                "fields": {
                  "id": 1,
                  "name": 1,
                  "address": 1,
                  "description": 1,
                  "collectionName": 1,
                  "collectionSymbol": 1,
                  "externalLink": 1,
                  "lastSale": 1,
                  "imageUrl": 1,
                  "smallImageUrl": 1,
                  "animationUrl": 1,
                  "standard": 1,
                  "openRarityRank": 1,
                  "perItemEthPrice": 1,
                  "decimals": 1,
                  "supportsWyvern": 1,
                  "market": 1,
                  "currentBasePrice": 1,
                  "paymentToken": 1,
                  "marketUrl": 1,
                  "marketplace": 1,
                  "tokenId": 1,
                  "priceInfo": 1,
                  "tokenReserves": 1,
                  "pendingTrxs": 1,
                  "ethReserves": 1,
                  "sudoPoolAddress": 1,
                  "traits": 1,
                  "sellOrders": 1,
                  "creator": 1,
                  "owner": 1,
                  "rarityScore": 1
                },
                "offset": 0,
                "limit": 1,
                "status": [
                  "all"
                ]
            });
            
            let data = await fetch('https://api-v2-1.gemlabs.xyz/assets', {
                method:"POST",
                headers: {
                    "origin": "https://www.gem.xyz",
                    "x-api-key": "rLnNH1tdrT09EQjGsjrSS7V3uGonfZLW",
                    "Content-Type": "application/json"
                },
                body:raw
            }).then(r=>r.json());
            
            let respData = {success: true, data: data['data'][0]};
            // console.log('respData', respData); 
            return res.json(respData);
            
        } catch (error) {
            return res.json({"success": false, error}); 
        }

    }
    else {
        return res.json({"success": false, 'error': 'Invalid RigId'});
    }

}