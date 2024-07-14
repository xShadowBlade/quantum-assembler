/**
 * @file Declares the cell display component
 */
import React, { useState } from "react";
import type { QACell } from "../../game/quantumAssembler/qaCell";

/**
 * The properties of the cell display component
 */
interface CellDisplayProps {
    /** The cell to display */
    cell: QACell;
}

/**
 * @returns The cell display component
 * @param props The properties of the cell display component
 */
const CellDisplay: React.FC<CellDisplayProps> = ({ cell }) => {

    return (
        <></>
    );
};
