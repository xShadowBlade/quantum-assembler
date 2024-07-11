/**
 * @file Declares the main app component
 */
import React, { useState } from "react";
import GridVisuals from "./grid";


/**
 * The main app component. Also contains global / shared state and functions.
 * @returns The main app component
 */
const App: React.FC = () => {
    // When render is changed, the component will rerender
    const [render, setRender] = useState(0);

    /**
     * Rerenders the component
     */
    function rerender (): void {
        setRender(render + 1);
    };

    return (
        <div style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
        }}>
            <h1>Quantum Assembler</h1>
            <GridVisuals
                rerender={rerender}
            />
        </div>
    );
};

export default App;
