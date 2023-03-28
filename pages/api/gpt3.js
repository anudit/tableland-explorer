if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not defined in env."
    );
}

const makePrompt = (query, schema) => {
    const prompt =  `Translate this natural language query into SQL:
${query}
Use this table schema:
${schema.replaceAll('\n', '').replaceAll('    ', '')}
The SQL specification only allows for the following structure of a select statement written in a single line
SELECT [ ALL | DISTINCT ]
[ * | expression [, ...] ]
[ FROM from_clause [, ...] ]
[ WHERE where_clause ]
[ GROUP BY [ expression [, ...] ]
[ ORDER BY expression [ ASC | DESC ]
[ LIMIT { count | ALL } ]
[ OFFSET { number } ]
SQL Query:`.replaceAll('\t', '');
    return prompt;
}

const handler = async (req, res) => {

    const { query, schema } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [{"role": "user", "content": makePrompt(query, schema)}],
                temperature: 0.5,
                max_tokens: 2048,
                n: 1,
                stop: "\\n",
                model: "gpt-3.5-turbo",
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
            }),
        });
    
        let resp = await response.json();
        return res.json({generatedSQL: resp['choices'][0]['message']['content']});
        
    } catch (error) {
        res.status(500).json({error})
    }


}

export default handler;
