import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Grid } from "@githubocto/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import NavBar from '../components/NavbarInteractive';
import Head from 'next/head';

const IdentitySection = () => {

    const router = useRouter();
    const { query } = router.query;
    const [refreshing, setRefreshing] = useState(false);

    const { data, error, mutate, isValidating } = useSWR(
        query ? [`https://testnet.tableland.network/query?mode=json&s=${query}`] : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    async function refresh(){
        setRefreshing(true);
        let data = await fetcher(`https://testnet.tableland.network/query?mode=json&s=${query}`);
        mutate(data);
        setRefreshing(false);
    }

    if (error) return <div>failed to load, {error}</div>;
    if (!data) return (
        <Flex alignContent="center" direction="column" height="100vh" width="100vw">
            <Spinner />
        </Flex>
    );
    else {
        return (
            <>
                <Head>
                    <title>Tableland Explorer</title>
                    <meta name="title" content="Tableland Explorer" />
                    <meta name="description" content="An explorer for Tableland Network." />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://tableland.xyz/" />
                    <meta property="og:title" content="Tableland Explorer" />
                    <meta property="og:description" content="An explorer for Tableland Network." />
                    <meta property="og:image" content='https://i.imgur.com/5ErjwNI.png' />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://tableland.xyz/" />
                    <meta property="twitter:title" content="Tableland Explorer" />
                    <meta property="twitter:description" content="An explorer for Tableland Network." />
                    <meta property="twitter:image" content='https://i.imgur.com/5ErjwNI.png' />
                </Head>
                <NavBar refresh={refresh} isLoading={refreshing || isValidating} />
                <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                    {
                       data?.message ? (
                            <Alert status='error'>
                                <AlertIcon />
                                {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                            </Alert>
                       ) : (
                            <Grid data={data} downloadFilename='custom' />
                       )
                    }
                </chakra.div>
            </>
        )
    }

}

export default IdentitySection;
