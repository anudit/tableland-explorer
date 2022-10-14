export async function getStreanStatus(streamId){
    let data = await fetch(`https://livepeer.com/api/stream/${streamId}`).then(e=>e.json());
    return data;
}
