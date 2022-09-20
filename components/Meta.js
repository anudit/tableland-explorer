import React from 'react';
import Head from 'next/head';

const Meta = ({url}) => {
    return(
        <Head>
            <title>Tableland Explorer</title>
            <meta name="title" content="Tableland Explorer" />
            <meta name="description" content="An explorer for Tableland Network." />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://tableland.xyz/" />
            <meta property="og:title" content="Tableland Explorer" />
            <meta property="og:description" content="An explorer for Tableland Network." />
            <meta property="og:image" content={url || 'https://i.imgur.com/5ErjwNI.png'} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://tableland.xyz/" />
            <meta property="twitter:title" content="Tableland Explorer" />
            <meta property="twitter:description" content="An explorer for Tableland Network." />
            <meta property="twitter:image" content={url || 'https://i.imgur.com/5ErjwNI.png'} />
        </Head>
    )
}

export default Meta;
