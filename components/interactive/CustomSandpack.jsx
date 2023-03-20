import React from "react";
import {
    SandpackProvider,
    SandpackThemeProvider,
    SandpackPreview,
    SandpackCodeEditor,
    SandpackLayout,
} from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";
import {useMediaQuery} from "@chakra-ui/react";

const CustomSandpack = (props) => {

    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')

    return (
        <SandpackProvider template='nextjs' customSetup={props.customSetup} files={props.files}>
            <SandpackThemeProvider theme={amethyst}>
                <SandpackLayout>
                    <SandpackFileExplorer style={{
                        height: isLargerThan768 ? "800px" : "200px",
                    }}/>
                    <SandpackPreview
                        style={{
                            width: "100%",
                            height: isLargerThan768 ? "800px" : "500px",
                        }}
                    />
                    <SandpackCodeEditor
                        style={{
                            width: "100%",
                            height: "800px",
                        }}
                        showLineNumbers={true}
                    />
                </SandpackLayout>
            </SandpackThemeProvider>
        </SandpackProvider>
    )
};

export default CustomSandpack;