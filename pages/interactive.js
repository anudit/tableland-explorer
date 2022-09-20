import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertIcon, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Grid } from "@githubocto/flat-ui";
import useSWR from "swr";

import fetcher from '@/utils/fetcher';
import NavBar from '../components/NavbarInteractive';
import Meta from '@/components/Meta';

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
    return (
        <>
            <Meta />
            <NavBar refresh={refresh} isLoading={refreshing || isValidating} />
            <chakra.div position="relative" height="calc(100vh - 50px)" width="100%">
                    {
                    data ? data?.message ? (
                        <Alert status='error'>
                            <AlertIcon />
                            {data?.message === "Row not found"? "Row not found, The table is empty." : data?.message}
                        </Alert>
                    ) : (
                        <Grid data={data} downloadFilename='custom' />
                    ) : (
                        <Flex w="100vw" h="100vh" justifyContent='center' alignItems='center'>
                            <Spinner />
                        </Flex>
                    )
                }
            </chakra.div>
        </>
    )

}

export default IdentitySection;
