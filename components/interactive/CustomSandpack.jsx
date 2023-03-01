import React from "react";
import {
    SandpackProvider,
    SandpackThemeProvider,
    SandpackPreview,
    SandpackCodeEditor,
    SandpackLayout,
} from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import {useMediaQuery} from "@chakra-ui/react";

const CustomSandpack = (props) => {

    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')

    return (
        <SandpackProvider template='nextjs' customSetup={props.customSetup} files={props.files}>
            <SandpackThemeProvider theme={sandpackDark}>
                <SandpackLayout>
                    <SandpackFileExplorer style={{
                        height: isLargerThan768 ? "600px" : "200px",
                    }}/>
                    <SandpackPreview
                        style={{
                            width: "100%",
                            height: "600px",
                        }}
                    />
                    <SandpackCodeEditor
                        style={{
                            width: "100%",
                            height: "600px",
                        }}
                        showLineNumbers={true}
                    />
                </SandpackLayout>
            </SandpackThemeProvider>
        </SandpackProvider>
    )
};

export default CustomSandpack;