/**
 * @file Declares the shop component to buy cells
 */
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Decimal } from "emath.js";
import type { GridDirectionCell } from "emath.js";
// import { setCell } from "./grid/qaCell";
import type { QACellType } from "../game/quantumAssembler/cellTypes";
import { energy } from "../game/energy";

import { useGameState } from "../gameStateContext";
import type { ShopSelectedCell } from "../gameStateContext";

// TODO
const CellShopItem: React.FC = () => {
    const gameState = useGameState();

    const selectedCell = gameState.selectedShopCell;

    return (
        <Button
            onClick={() => {
                // setShopSelectedCell(selectedCell);
                gameState.set("selectedShopCell", selectedCell);
            }}
        >
            {/* {shopSelectedCell.type} */}
        </Button>
    );

}

/**
 * @returns The shop component to buy cells
 */
const CellShop: React.FC = () => {

    const gameState = useGameState();

    return (
        <div>
            {gameState.render}
        </div>
    );
};

export default CellShop;
