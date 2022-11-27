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


export const toProperCase = (inp) => {
    return inp.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export const networkDeets = {
    1: {
        name: "Ethereum",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1664030600/convo/ethereum.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tableland-ethereum/v1.11",
        explorer: "https://etherscan.io",
        contractAddress: "0x012969f7e3439a9B04025b5a049EB9BAD82A8C12",
        faucet: false,
        blocktime: 12,
    },
    137: {
        name: "Polygon",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663573250/convo/polygon-token.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-polygon",
        explorer: "https://polygonscan.com",
        contractAddress: "0x5c4e6A9e5C1e1BF445A062006faF19EA6c49aFeA",
        faucet: false,
        blocktime: 5,
    },
    10: {
        name: "Optimism",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663573617/convo/optimism.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-optimism",
        explorer: "https://optimistic.etherscan.io",
        contractAddress: "0xfad44BF5B843dE943a09D4f3E84949A11d3aa3e6",
        faucet: false,
        blocktime: 10,
    },
    80001: {
        name: "Polygon Mumbai",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1667715597/convo/polygon-mumbai.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland",
        explorer: "https://mumbai.polygonscan.com",
        contractAddress: "0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68",
        faucet: "https://faucet.polygon.technology",
        blocktime: 5,
    },
    420: {
        name: "Optimism Görli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1667715370/convo/optimism-goerli.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-optimism-goerli",
        explorer: "https://goerli-optimism.etherscan.io",
        contractAddress: "0xC72E8a7Be04f2469f8C2dB3F1BdF69A7D516aBbA",
        faucet: "https://app.optimism.io/bridge",
        blocktime: 10,
    },
    421613: {
        name: "Arbitrum Görli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663577114/convo/Arbitrum.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-arbitrum-goerli",
        explorer: "https://testnet.arbiscan.io",
        contractAddress: "0x033f69e8d119205089Ab15D340F5b797732f646b",
        faucet: "https://bridge.arbitrum.io",
        blocktime: 5,
    },
    5: {
        name: "Ethereum Görli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1667714513/convo/go.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tableland-ethereum-goerli/v1.11",
        explorer: "https://goerli.etherscan.io",
        contractAddress: "0xDA8EA22d092307874f30A1F277D1388dca0BA97a",
        faucet: "https://faucet.paradigm.xyz/",
        blocktime: 12,
    }
}

export function nameToAvatar(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].avatar;
    else return null;
}

export function nameToTime(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].blocktime;
    else return null;
}

export function nameToChainName(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].name;
    else return null;
}

export function nameToSubgraph(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].subgraph;
    else return null;
}

export function nameToExplorer(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].explorer;
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
    if (size<1000000000) return (size/1000000).toFixed(2) + " KB";
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