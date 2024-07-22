/**
 * @file Declares the game state context provider.
 * Also includes the theme provider.
 */
import React, { createContext, useContext, useState } from "react";
import { Decimal } from "emath.js";
import type { GridDirectionCell } from "emath.js";

// Color theme
import { cellTheme } from "./game/quantumAssembler/cellTypeColors";

// Providers
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
// import type { Theme } from "@mui/material/styles";

import type { QACellType } from "./game/quantumAssembler/cellTypes";
import type { RotateDirection } from "./game/quantumAssembler/quantumAssembler";

// Currency displays
import { energy, instability } from "./game/energy";

// Grid cell
import { quantumAssembler } from "./game/quantumAssembler/quantumAssembler";
import type { QACell } from "./game/quantumAssembler/qaCell";

/**
 * Removes all read-only keys from an object type.
 */
type OmitFunctions<T> = {
    // Create a new object type by removing functions keys
    [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K]: T[K];
};

/**
 * The mode of selecting a cell.
 * - `"select"`: Select a cell
 * - `"place"`: Place a cell
 * - `"remove"`: Remove a cell
 * - `"rotate"`: Rotate a cell, either clockwise or counter-clockwise (see {@link RotateDirection})
 */
type CellSelectMode = "select" | "place" | "remove" | "rotate";

/**
 * The selected cell to buy from the shop
 */
interface ShopSelectedCell {
    /**
     * The type of the cell
     */
    type: QACellType;

    /**
     * The tier of the cell
     */
    tier: Decimal;

    /**
     * The direction of the cell
     */
    direction: GridDirectionCell;
}

/**
 * The game state context
 */
interface GameState {
    // Functions are readonly, so they cannot be changed
    /**
     * Changes the game state of a specific property
     * @param key - The key of the property to change
     * @param value - The new value of the property
     */
    readonly set: <K extends keyof OmitFunctions<GameState>>(key: K, value: GameState[K]) => void;

    /**
     * Rerenders the component
     * @deprecated The global app componment is automatically rerendered every frame
     */
    readonly rerender: () => void;

    /**
     * The color theme of the game.
     * See {@link cellTheme}
     */
    readonly theme: typeof cellTheme;

    // The rest of the properties are mutable
    /**
     * The current frame number. Used to force rerenders.
     */
    render: number;

    /**
     * The selected cell to buy from the shop
     */
    selectedShopCell: ShopSelectedCell;

    /**
     * The mode of the cell selection.
     * See {@link CellSelectMode}
     */
    cellSelectMode: CellSelectMode;

    /**
     * The direction to rotate a cell.
     * See {@link RotateDirection}
     */
    cellRotationDirection: RotateDirection;

    /**
     * The coordinates of the selected cell (x, y)
     */
    selectedCoords: [number, number];

    getSelectedCell: (this: GameState) => QACell;

    // Currency displays
    energy: typeof energy;
    instability: typeof instability;
}

/**
 * The game state context
 */
// @ts-expect-error - The context is not created yet, so it is not possible to access the current value
const GameStateContext = createContext<GameState>();

const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [render, setRender] = useState(0);

    // Set the initial game state using the useState hook so that it can be updated
    const [gameState, setGameState] = useState<GameState>({
        set (key, value) {
            setGameState((prev) => ({
                ...prev,
                [key]: value,
            }));
        },

        theme: cellTheme,

        render: 0,
        rerender () {
            // setGameState((prev) => ({
            //     ...prev,
            //     render: prev.render + 1,
            // }));
            setRender((prev) => prev + 1);
        },

        selectedShopCell: {
            type: "void",
            tier: new Decimal(0),
            direction: "up",
        },
        cellSelectMode: "select",
        cellRotationDirection: "cw",
        selectedCoords: [0, 0],
        getSelectedCell () {
            // const gameStateInternal = this;

            // console.log("getSelectedCell", this);

            // Get the selected cell
            const [x, y] = this.selectedCoords;
            return quantumAssembler.getCell(x, y);
        },

        energy,
        instability,
    });

    // Return the game state context provider as well as the theme provider
    return (
        // StyledEngineProvider is required for use with tailwindcss
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={cellTheme}>
                <GameStateContext.Provider value={gameState}>
                    {children}
                </GameStateContext.Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

/**
 * Uses the game state context
 * @returns The game state
 */
const useGameState = (): GameState => useContext(GameStateContext);

export { GameStateProvider, useGameState };
export type { GameState, CellSelectMode, ShopSelectedCell };
