import { isAddress } from "ethers/lib/utils.js"

export default async function handler(req, res) {
    const { address } = req.query

    if (isAddress(address)){
        let data = await fetch(`https://carbon-footprint-dot-angle-1.ew.r.appspot.com/V1?address=${address}`).then(e=>e.json());
        return res.json(data)
    }
    else {
        return res.json(false)
    }

}
