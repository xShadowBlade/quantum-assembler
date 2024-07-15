/**
 * @file Declares the main app component
 */
import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";

import { Decimal } from "emath.js";
import type { GridDirectionCell } from "emath.js";

import type { QACellType } from "./game/quantumAssembler/cellTypes";

import GridVisuals from "./components/grid/grid";
import CellShop from "./components/shop";
import EnergyDisplay from "./components/energyDisplay";
import CellSelectModeComponent from "./components/grid/cellSelectMode";
import type { CellSelectMode } from "./components/grid/cellSelectMode";

// Color theme
import { cellTheme } from "./game/quantumAssembler/cellTypeColors";
import { ThemeProvider } from "@mui/material/styles";
import { Game } from "./game/game";
// import { energy } from "./grid/energy";
import type { RotateDirection } from "./game/quantumAssembler/quantumAssembler";

interface ShopSelectedCell {
    type: QACellType;
    tier: Decimal;
    direction: GridDirectionCell;
}

/**
 * The main app component. Also contains global / shared state and functions.
 * @returns The main app component
 */
const App: React.FC = () => {
    // When render is changed, the component will rerender
    const [render, setRender] = useState(0);

    /**
     * Rerenders the component
     * @deprecated The global app componment is automatically rerendered every frame
     */
    function rerender (): void {
        setRender(render + 1);
    }

    // The selected cell to buy from the shop
    const [selectedShopCell, setSelectedShopCell] = useState<ShopSelectedCell>({
        type: "void",
        tier: new Decimal(0),
        direction: "up",
    });

    // The mode of the cell selection
    const [cellSelectMode, setCellSelectMode] = useState<CellSelectMode>("select");

    // The direction to rotate a cell
    const [cellRotationDirection, setCellRotationDirection] = useState<RotateDirection>("cw");

    // The coordinates of the selected cell (x, y)
    const [selectedCoords, setSelectedCoords] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        // Rerender every frame
        Game.eventManager.setEvent("rerender", "interval", 0, (dt) => {
            rerender();

            // console.log({ dt })

            // Gain energy every frame
            // energy.gain(dt);
        });
    });

    return (<ThemeProvider theme={cellTheme}>
        <div style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
        }}>
            <h1>Quantum Assembler</h1>
            <EnergyDisplay />
            <GridVisuals
                render={render}
                rerender={rerender}
                selectedCoords={selectedCoords}
                setSelectedCoords={setSelectedCoords}
                theme={cellTheme}
                cellSelectMode={cellSelectMode}
                cellRotationDirection={cellRotationDirection}
            />

            {/* Debug */}
            Selected: ({selectedCoords[0]}, {selectedCoords[1]})
            <br />
            <CellSelectModeComponent
                cellSelectMode={cellSelectMode}
                setCellSelectMode={setCellSelectMode}
            />
            <br />
            <Button
                onClick={() => {
                    rerender();
                }}
            >
                Rerender
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    if (!window.confirm("Are you sure you want to reset the data?")) return;
                    Game.dataManager.resetData(true);
                }}
            >Reset Data</Button>
            <hr />
            <CellShop
                rerender={rerender}
                shopSelectedCell={selectedShopCell}
                setShopSelectedCell={setSelectedShopCell}
                selectedCoords={selectedCoords}
                setSelectedCoords={setSelectedCoords}
            />
        </div>
    </ThemeProvider>);
};

export default App;
export type { ShopSelectedCell, CellSelectMode };
