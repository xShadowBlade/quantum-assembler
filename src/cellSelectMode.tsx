/**
 * @file Declares the cell select mode component
 */
import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

/**
 * The mode of selecting a cell.
 * - `"select"`: Select a cell
 * - `"place"`: Place a cell
 * - `"remove"`: Remove a cell
 * - `"rotate"`: Rotate a cell, either clockwise or counter-clockwise (see {@link RotateDirection})
 */
type CellSelectMode = "select" | "place" | "remove" | "rotate";

/**
 * The properties of the cell select mode component
 */
interface CellSelectModeProps {
    cellSelectMode: CellSelectMode;
    setCellSelectMode: React.Dispatch<React.SetStateAction<CellSelectMode>>;
}

/**
 * The cell select mode component
 * @param props The properties of the cell select mode component
 * @returns The cell select mode component
 */
const CellSelectModeComponent: React.FC<CellSelectModeProps> = (props) => {
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Cell Select Mode</FormLabel>
            <RadioGroup
                aria-label="cell-select-mode"
                name="cell-select-mode"
                value={props.cellSelectMode}
                onChange={(event) => { props.setCellSelectMode(event.target.value as CellSelectMode); }}
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
