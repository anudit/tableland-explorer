import hslRgb from "hsl-rgb";
import hslTriad from "hsl-triad";
import stringHash from "string-hash";

export const fromB64 = (b64) => {

    if (Boolean(b64) == false){
        return "";
    }
    else {
        let buff = new Buffer.from(b64, 'base64');
        let text = buff.toString('ascii');
        return text;
    }
};

export const toB64 = (url) => {
    if (Boolean(url) == false){
        return "";
    }
    else {
        let buff = new Buffer.from(url, 'ascii');
        let text = buff.toString('base64');
        return text;
    }
};


export const cleanAdd = (message) => {

    let regex = /(@0x[a-fA-F0-9]{40})/g;
    let m;
    let result = [];
    while ((m = regex.exec(message)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    for (var i = 0; i < result.length; i++) {
        message  = message.replace(result[i],truncateAddress(result[i]))
    }
    return message;
};

export const truncateAddress = (address, len=4) => {
    return address?.slice(2, 2+len) + "—" + address?.slice(-len);
};


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomId = (length = 20) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const prettyTime = (timestamp) => {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dt = new Date(parseInt(timestamp));
    const ampm = dt.getHours() <= 12 ? "AM" : "PM"
    const h = dt.getHours() <= 12 ? dt.getHours() : dt.getHours()-12;
    const m = dt.getMinutes().toString().padStart(2,'0');
    const d = dt.getDate();
    const month = monthNames[dt.getMonth()];
    const y = dt.getFullYear();
    return `${h}:${m} ${ampm} • ${d} ${month} '${String(y).slice(2,String(y).length)}`;

}

export const prettifyNumber = (num, digits=2) => {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export const cleanDecimals = (num) => new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);

export const toProperCase = (inp) => {
    return inp.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export const GAS_PER_KB = 30000;
export const tablelandAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ApprovalCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"ApprovalQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"BalanceQueryForZeroAddress","type":"error"},{"inputs":[],"name":"InvalidQueryRange","type":"error"},{"inputs":[{"internalType":"uint256","name":"querySize","type":"uint256"},{"internalType":"uint256","name":"maxQuerySize","type":"uint256"}],"name":"MaxQuerySizeExceeded","type":"error"},{"inputs":[],"name":"MintERC2309QuantityExceedsLimit","type":"error"},{"inputs":[],"name":"MintToZeroAddress","type":"error"},{"inputs":[],"name":"MintZeroQuantity","type":"error"},{"inputs":[],"name":"OwnerQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"OwnershipNotInitializedForExtraData","type":"error"},{"inputs":[],"name":"TransferCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"TransferFromIncorrectOwner","type":"error"},{"inputs":[],"name":"TransferToNonERC721ReceiverImplementer","type":"error"},{"inputs":[],"name":"TransferToZeroAddress","type":"error"},{"inputs":[],"name":"URIQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"Unauthorized","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toTokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"ConsecutiveTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tableId","type":"uint256"},{"indexed":false,"internalType":"string","name":"statement","type":"string"}],"name":"CreateTable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"bool","name":"isOwner","type":"bool"},{"indexed":false,"internalType":"uint256","name":"tableId","type":"uint256"},{"indexed":false,"internalType":"string","name":"statement","type":"string"},{"components":[{"internalType":"bool","name":"allowInsert","type":"bool"},{"internalType":"bool","name":"allowUpdate","type":"bool"},{"internalType":"bool","name":"allowDelete","type":"bool"},{"internalType":"string","name":"whereClause","type":"string"},{"internalType":"string","name":"withCheck","type":"string"},{"internalType":"string[]","name":"updatableColumns","type":"string[]"}],"indexed":false,"internalType":"struct TablelandPolicy","name":"policy","type":"tuple"}],"name":"RunSQL","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tableId","type":"uint256"},{"indexed":false,"internalType":"address","name":"controller","type":"address"}],"name":"SetController","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tableId","type":"uint256"}],"name":"TransferTable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"statement","type":"string"}],"name":"createTable","outputs":[{"internalType":"uint256","name":"tableId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"explicitOwnershipOf","outputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint64","name":"startTimestamp","type":"uint64"},{"internalType":"bool","name":"burned","type":"bool"},{"internalType":"uint24","name":"extraData","type":"uint24"}],"internalType":"struct IERC721AUpgradeable.TokenOwnership","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"explicitOwnershipsOf","outputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint64","name":"startTimestamp","type":"uint64"},{"internalType":"bool","name":"burned","type":"bool"},{"internalType":"uint24","name":"extraData","type":"uint24"}],"internalType":"struct IERC721AUpgradeable.TokenOwnership[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tableId","type":"uint256"}],"name":"getController","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"caller","type":"address"},{"internalType":"uint256","name":"tableId","type":"uint256"}],"name":"lockController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"caller","type":"address"},{"internalType":"uint256","name":"tableId","type":"uint256"},{"internalType":"string","name":"statement","type":"string"}],"name":"runSQL","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"caller","type":"address"},{"internalType":"uint256","name":"tableId","type":"uint256"},{"internalType":"address","name":"controller","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"stop","type":"uint256"}],"name":"tokensOfOwnerIn","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}];

export const networkDeets = {
    1: {
        name: "Ethereum",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1664030600/convo/ethereum.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tableland-ethereum/v1.12",
        explorer: "https://etherscan.io",
        contractAddress: "0x012969f7e3439a9B04025b5a049EB9BAD82A8C12",
        chonkLimit: 14.5,
        faucet: false,
        blocktime: 12,
    },
    137: {
        name: "Polygon",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663573250/convo/polygon-token.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-polygon",
        explorer: "https://polygonscan.com",
        contractAddress: "0x5c4e6A9e5C1e1BF445A062006faF19EA6c49aFeA",
        chonkLimit: 35,
        faucet: false,
        blocktime: 5,
    },
    10: {
        name: "Optimism",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663573617/convo/optimism.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-optimism",
        explorer: "https://optimistic.etherscan.io",
        contractAddress: "0xfad44BF5B843dE943a09D4f3E84949A11d3aa3e6",
        chonkLimit: 35,
        faucet: false,
        blocktime: 10,
    },
    80001: {
        name: "Polygon Mumbai",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1667715597/convo/polygon-mumbai.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tablescan-polygon-mumbai/v1.12",
        explorer: "https://mumbai.polygonscan.com",
        contractAddress: "0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68",
        chonkLimit: 35,
        faucet: "https://faucet.polygon.technology",
        blocktime: 5,
    },
    420: {
        name: "Optimism Görli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1667715370/convo/optimism-goerli.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tablescan-optimism-goerli/v1.12",
        explorer: "https://goerli-optimism.etherscan.io",
        contractAddress: "0xC72E8a7Be04f2469f8C2dB3F1BdF69A7D516aBbA",
        chonkLimit: 35,
        faucet: "https://app.optimism.io/bridge",
        blocktime: 10,
    },
    42161: {
        name: "Arbitrum One",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663577114/convo/Arbitrum.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tablescan-arbitrum/v1.12",
        explorer: "https://arbiscan.io",
        contractAddress: "0x9aBd75E8640871A5a20d3B4eE6330a04c962aFfd",
        chonkLimit: 35,
        faucet: false,
        blocktime: 5,
    },
    42170: {
        name: "Arbitrum Nova",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663577114/convo/Arbitrum.svg",
        rpc: "https://nova.arbitrum.io/rpc",
        explorer: "https://nova.arbiscan.io/",
        contractAddress: "0x1a22854c5b1642760a827f20137a67930ae108d2",
        fromBlock: 3004125,
        chonkLimit: 35,
        faucet: false,
        blocktime: 3,
    },
    421613: {
        name: "Arbitrum Görli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1669746109/convo/arb-goerli.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tablescan-arbitrum-goerli/v1.12",
        explorer: "https://testnet.arbiscan.io",
        contractAddress: "0x033f69e8d119205089Ab15D340F5b797732f646b",
        chonkLimit: 35,
        faucet: "https://bridge.arbitrum.io",
        blocktime: 5,
    },
    5: {
        name: "Ethereum Görli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1667714513/convo/go.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tableland-ethereum-goerli/v1.12",
        explorer: "https://goerli.etherscan.io",
        contractAddress: "0xDA8EA22d092307874f30A1F277D1388dca0BA97a",
        chonkLimit: 35,
        faucet: "https://faucet.paradigm.xyz/",
        blocktime: 12,
    },
    314: {
        name: "Filecoin",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1680283934/convo/fil.svg",
        rpc: "https://filecoin-mainnet.chainstacklabs.com/rpc/v1",
        explorer: "https://filfox.info/en",
        contractAddress: "0x59EF8Bf2d6c102B4c42AEf9189e1a9F0ABfD652d",
        fromBlock: 2718630,
        chonkLimit: 14.5,
        faucet: false,
        blocktime: 120,
    },
    3141: {
        name: "Filecoin Hyperspace",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1680283934/convo/fil.svg",
        rpc: "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1",
        explorer: "https://filfox.info/en",
        contractAddress: "0x0B9737ab4B3e5303CB67dB031b509697e31c02d3",
        fromBlock: 200531,
        chonkLimit: 14.5,
        faucet: "https://hyperspace.yoga/#faucet",
        blocktime: 120,
    }
}

export function nameToAvatar(name){
    let {chainId} = parseTableData(name);
    if (Object.keys(networkDeets).includes(String(chainId))){
        if(chainId) return networkDeets[chainId].avatar;
        else return null;
    }
    else return null;
   
}

export function nameToTime(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId]?.blocktime;
    else return null;
}

export function isMainnetTable(tableName){
    let {chainId} = parseTableData(tableName);

    // eslint-disable-next-line no-extra-boolean-cast
    if(chainId) return !Boolean(networkDeets[chainId]?.faucet);
    else return true;
}

export function nameToChainName(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].name;
    else return null;
}

export function nameToSubgraph(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId]?.subgraph;
    else return null;
}

export function nameToExplorer(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId]?.explorer;
    else return null;
}

export function parseTableData(tableName){
    try {
        if (tableName){
            let tableSplit = tableName.split('_');
            // if (tableSplit.ke)
            let chainId = tableSplit[tableSplit.length-2];
            let tableId = tableSplit[tableSplit.length-1];

            return {
                valid: true,
                tableId: tableId,
                chainId: parseInt(chainId),
                tableName: tableName,
            }
        }
        else {
            return {
                valid: false,
                tableId: "",
                chainId: 0,
                tableName: "",
            }
        }
    } catch (error) {
        return {
            valid: false,
            tableId: "",
            chainId: 0,
            tableName: "",
        }
    }
}



export function stringSize(string){
    let size = new Blob([string]).size;
    if (size<1000) return size + " B";
    if (size<1000000) return (size/1000).toFixed(2) + " KB";
    if (size<1000000000) return (size/1000000).toFixed(2) + " MB";
    return size+"B";
}


export function freqTable(arr = []){
    let dict = {};
    for (let i = 0; i < arr.length; i++) {
        if (Object.keys(dict).includes(arr[i])){
            dict[arr[i]]+=1;
        }
        else {
            dict[arr[i]]=1;
        }
    }
    return dict;
}

export function countdown(s) {

  const d = Math.floor(s / (3600 * 24));

  s  -= d * 3600 * 24;

  const h = Math.floor(s / 3600);

  s  -= h * 3600;

  const m = Math.floor(s / 60);

  s  -= m * 60;

  const tmp = [];

  (d) && tmp.push(d + 'd');

  (d || h) && tmp.push(h + 'h');

  (d || h || m) && tmp.push(m + 'm');

  tmp.push(parseInt(s) + 's');

  return tmp.join(' ');
}

export default function timeAgo(time) {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        if(time.length <= "10"){
          time = time+"000";
        }
        time = +new Date(parseInt(time));
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, "s", 1], // 60
      [120, "1min ago", "1 minute from now"], // 60*2
      [3600, "mins", 60], // 60*60, 60
      [7200, "1hr ago", "1 hour from now"], // 60*60*2
      [86400, "h", 3600], // 60*60*24, 60*60
      [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
      [604800, "d", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
      [2419200, "w", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, " mths", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last yr", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "yrs", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "ago",
      list_choice = 1;

    if (seconds == 0) {
      return "Just now";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + format[1] + " " + token;
      }
    return time;
  }

const uniqueID = () => Math.floor(Math.random() * Date.now());

export const avatar = (str, size = undefined) => {
    if(Boolean(str) === false) return ``;
    const hash = stringHash(str);
    const colors = hslTriad(hash % 360, 1, 0.5);
    const color1 = hslRgb(colors[0][0], colors[0][1], colors[0][2]);
    const color2 = hslRgb(colors[1][0], colors[1][1], colors[1][2]);
    const color1str = `rgb(${ color1[0] }, ${ color1[1] }, ${ color1[2] })`;
    const color2str = `rgb(${ color2[0] }, ${ color2[1] }, ${ color2[2] })`;
    const id = uniqueID();

    return `
    <svg ${ size != undefined ? `width="${size}px" height="${size}px"` : '' } viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="${id}">
                <stop stop-color="${color1str}" offset="0%"></stop>
                <stop stop-color="${color2str}" offset="100%"></stop>
            </linearGradient>
        </defs>
        <path fill="url(#${id})" fill-rule="evenodd" d="M0 0h80v80H0z"/>
    </svg>`;
};

// export function getImageDataURL(svgXml) {
//     console.log(svgXml);
//     return "data:image/svg+xml;base64," + svgXml.toString('base64');
// }

export function getImageDataURL(svgXml) {
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgXml)));
}

export function encodeSqlForUrl(sql){
    return encodeURIComponent(sql.replaceAll('%', '%25').replaceAll('*', '%2A'))
}

export function mergeKeyValue(keys, values){
    let dict = {};
    for (let index = 0; index < keys.length; index++) {
        dict[keys[index]] = values[index];
    }
    return dict;
}
