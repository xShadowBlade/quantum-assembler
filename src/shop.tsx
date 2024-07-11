/**
 * @file Declares the shop component to buy cells
 */
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Decimal } from "emath.js";
import type { GridDirectionCell } from "emath.js";
// import { setCell } from "./grid/qaCell";
import type { QACellType } from "./grid/cellTypes";
import { energy } from "./grid/energy";

/**
 * The props of the cell shop component
 */
interface CellShopProps {
    rerender: () => void;
}

/**
 * @returns The shop component to buy cells
 * @param props - The props of the component
 */
const CellShop: React.FC<CellShopProps> = (props) => {
    const { rerender } = props;

    // The selected cell to buy
    const [selectedCell, setSelectedCell] = useState<{
        type: QACellType;
        tier: Decimal;
        direction: GridDirectionCell;
    }>({
        type: "void",
        tier: new Decimal(0),
        direction: "up",
    });

    // The coordinates of the selected cell (x, y)
    const [selectCoords, setSelectCoords] = useState<[number, number]>([0, 0]);

    return (
        <div>
            
        </div>
    );
};

export default CellShop;
