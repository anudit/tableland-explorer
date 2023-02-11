import React from 'react';
import Head from 'next/head';

const Meta = ({url, title}) => {
    return(
        <Head>
            <title>{title || "Tablescan.io"}</title>
            <meta name="title" content={title || "Tablescan.io"} />
            <meta name="description" content="An explorer for Tableland Network." />
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="apple-touch-icon" href="favicon.svg"/>
            <link rel="manifest" href="/manifest.json"></link>

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://tableland.xyz/" />
            <meta property="og:title" content={title || "Tablescan.io"} />
            <meta property="og:description" content="An explorer for Tableland Network." />
            <meta property="og:image" content={url || 'https://res.cloudinary.com/anudit/image/upload/v1674573911/convo/tablescan.png'} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://tableland.xyz/" />
            <meta property="twitter:title" content={title || "Tablescan.io"} />
            <meta property="twitter:description" content="An explorer for Tableland Network." />
            <meta property="twitter:image" content={url || 'https://res.cloudinary.com/anudit/image/upload/v1674573911/convo/tablescan.png'} />

            <meta name="theme-color" content="#000" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;500;800&display=swap" rel="stylesheet"></link>

        </Head>
    )
}

export default Meta;
