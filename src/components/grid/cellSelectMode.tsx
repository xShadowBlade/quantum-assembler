/**
 * @file Declares the cell select mode component
 */
import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import { useGameState } from "../../gameStateContext";

/**
 * The mode of selecting a cell.
 * - `"select"`: Select a cell
 * - `"place"`: Place a cell
 * - `"remove"`: Remove a cell
 * - `"rotate"`: Rotate a cell, either clockwise or counter-clockwise (see {@link RotateDirection})
 */
type CellSelectMode = "select" | "place" | "remove" | "rotate";

/**
 * @returns The cell select mode component
 */
const CellSelectModeComponent: React.FC = () => {
    const gameState = useGameState();

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Cell Select Mode</FormLabel>
            <RadioGroup
                aria-label="cell-select-mode"
                name="cell-select-mode"
                value={gameState.cellSelectMode}
                onChange={(event) => {
                    gameState.set("cellSelectMode", event.target.value as CellSelectMode);
                }}
            >
                <FormControlLabel value="select" control={<Radio />} label="Select" />
                <FormControlLabel value="place" control={<Radio />} label="Place" />
                <FormControlLabel value="remove" control={<Radio />} label="Remove" />
                <FormControlLabel value="rotate" control={<Radio />} label="Rotate" />
            </RadioGroup>
        </FormControl>
    );
};

export default CellSelectModeComponent;
export type { CellSelectMode };
