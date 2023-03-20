import React from "react";
import { Flex } from "@chakra-ui/react";

import UniversalSearch from "@/components/UniversalSearch";
import Footer from "@/components/Footer";
import Meta from "@/components/Meta";

export default function PageShell({children, searchProps, title, url}) {

    return (
        <Flex
            direction='column'
            fontFamily='inherit'
            backgroundImage="url(/lightbackground.png)"
            backgroundRepeat="no-repeat"
            backgroundPosition="top right"
            backgroundAttachment="fixed"
            alignItems='center'
        >
            <Meta title={title} url={url}/> 
            <UniversalSearch {...searchProps}/>
            
            
            {children}

            <Footer/>
        </Flex>
    )

}
