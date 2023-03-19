import withCors from "middleware/withCors";

const handler = async (req, res) => {

    const {inputText, tableSchema} = req.query;

    try {
        let data = await fetch('https://www.sqltranslate.app/api/translate', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputText: decodeURIComponent(inputText), 
                tableSchema: decodeURIComponent(tableSchema)
            })
        })
        let resp = await data.json();
        return res.json(resp);
        
    } catch (error) {
        return res.status(500).json({error})
    }

}

export default withCors(handler);
