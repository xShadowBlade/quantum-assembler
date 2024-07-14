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
import type { ShopSelectedCell } from "../app";

/**
 * The props of the cell shop component
 */
interface CellShopProps {
    rerender: () => void;

    shopSelectedCell: ShopSelectedCell;
    setShopSelectedCell: React.Dispatch<React.SetStateAction<ShopSelectedCell>>;

    selectedCoords: [number, number];
    setSelectedCoords: React.Dispatch<React.SetStateAction<[number, number]>>;
}

/**
 * @returns The shop component to buy cells
 * @param props - The props of the component
 */
const CellShop: React.FC<CellShopProps> = (props) => {
    const { rerender } = props;

    return (
        <div>
            
        </div>
    );
};

export default CellShop;
