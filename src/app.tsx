/**
 * @file Declares the main app component
 */
import React, { useState } from "react";

import Button from "@mui/material/Button";

import { Decimal } from "emath.js";
import type { GridDirectionCell } from "emath.js";

import type { QACellType } from "./grid/cellTypes";

import GridVisuals from "./grid";

// Color theme
import { cellTheme } from "./grid/cellTypeColors";
import { ThemeProvider } from "@mui/material/styles";


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

    // The selected cell to buy from the shop
    const [selectedShopCell, setSelectedShopCell] = useState<{
        type: QACellType;
        tier: Decimal;
        direction: GridDirectionCell;
    }>({
        type: "void",
        tier: new Decimal(0),
        direction: "up",
    });

    // The coordinates of the selected cell (x, y)
    const [selectedCoords, setSelectedCoords] = useState<[number, number]>([0, 0]);

    return (<ThemeProvider theme={cellTheme}>
        <div style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
        }}>
            <h1>Quantum Assembler</h1>
            <GridVisuals
                render={render}
                rerender={rerender}
                selectedCoords={selectedCoords}
                setSelectedCoords={setSelectedCoords}
                theme={cellTheme}
            />

            {/* Debug */}
            Selected: ({selectedCoords[0]}, {selectedCoords[1]})
            <br />
            <Button
                onClick={() => {
                    rerender();
                }}
            >
                Rerender
            </Button>
        </div>
    </ThemeProvider>);
};

export default App;
