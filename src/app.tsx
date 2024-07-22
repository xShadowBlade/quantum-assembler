/**
 * @file Declares the main app component
 */
import React, { useEffect } from "react";

import Button from "@mui/material/Button";

// import { Decimal } from "emath.js";
// import type { GridDirectionCell } from "emath.js";

// import type { QACellType } from "./game/quantumAssembler/cellTypes";

import GridVisuals from "./components/grid/grid";
import CellShop from "./components/shop";
import EnergyDisplay from "./components/energyDisplay";
import CellSelectModeComponent from "./components/grid/cellSelectMode";
import DebugDevelopment from "./components/debugDevelopment";

import { Game } from "./game/game";

// State provider
import { GameStateProvider } from "./gameStateContext";

/**
 * The main app component. Also contains global / shared state and functions.
 * @returns The main app component
 */
const App: React.FC = () => {
    // useEffect(() => {
    //     // Rerender every frame
    //     Game.eventManager.setEvent("rerender", "interval", 0, (dt) => {
    //         rerender();

    //         // console.log({ dt })

    //         // Gain energy every frame
    //         // energy.gain(dt);
    //     });
    // });

    return (<GameStateProvider>
        <div style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
        }}>
            <h1 className="text-4xl font-bold text-blue-950">
                Quantum Assembler
            </h1>
            {/* <h1>Quantum Assembler</h1> */}

            {/* test */}
            {/* <p className="text-red-500">
                red text
            </p> */}

            <EnergyDisplay />
            <GridVisuals />

            {/* Debug */}
            <DebugDevelopment />
            <br />
            <CellSelectModeComponent />
            <br />
            {/* <Button
                onClick={() => {
                    rerender();
                }}
            >
                Rerender
            </Button> */}
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    if (!window.confirm("Are you sure you want to reset the data?")) return;
                    Game.dataManager.resetData(true);
                }}
            >Reset Data</Button>
            <hr />
            <CellShop />
        </div>
    </GameStateProvider>);
};

export default App;
