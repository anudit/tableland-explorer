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
    return address?.slice(0, 2+len) + "..." + address?.slice(-len);
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
    return `${h}:${m} ${ampm} •  ${month} ${d}, ${y}`;

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
    80001: {
        name: "Polygon Mumbai",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663573250/convo/polygon-token.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland",
        explorer: "https://mumbai.polygonscan.com"
    },
    420: {
        name: "Optimism Goerli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663573617/convo/optimism.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-optimism-goerli",
        explorer: "https://goerli-optimism.etherscan.io"
    },
    421613: {
        name: "Arbitrum Goerli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1663577114/convo/Arbitrum.svg",
        subgraph: "https://api.thegraph.com/subgraphs/name/anudit/tableland-arbitrum-goerli",
        explorer: "https://testnet.arbiscan.io"
    },
    5: {
        name: "Ethereum Goerli",
        avatar: "https://res.cloudinary.com/anudit/image/upload/v1664030600/convo/ethereum.svg",
        subgraph: "https://api.studio.thegraph.com/query/1649/tableland-ethereum-goerli/v1.0",
        explorer: "https://goerli.etherscan.io"
    }
}

export function nameToAvatar(name){
    let {chainId} = parseTableData(name);

    if(chainId) return networkDeets[chainId].avatar;
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

