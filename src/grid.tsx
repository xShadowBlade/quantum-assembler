/**
 * @file Visuals for the grid
 */
import React, { useEffect, useState } from "react";
import type { ButtonOwnProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import GridComponent from "@mui/material/Grid";
// import Slider from "@mui/material/Slider";
// import Checkbox from "@mui/material/Checkbox";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormLabel from "@mui/material/FormLabel";
// import FormControl from "@mui/material/FormControl";
// import FormControlLabel from "@mui/material/FormControlLabel";
import { Grid, GridCell, GridCellCollection } from "emath.js";

import { quantumAssembler } from "./grid/quantumAssembler";
import type { QAGridCell } from "./grid/quantumAssembler";

/**
 * The properties of the grid cell component.
 */
interface GridCellComponentProps {
    cell: GridCell<QAGridCell>;
    rerender: () => void;
    // render: number;
    // setRender: React.Dispatch<React.SetStateAction<number>>;
    // selected: GridCell<GridCellProps> | null;
    // setSelected: (cell: GridCell<QAGridCell>) => void;
}

const GridCellComponent: React.FC<GridCellComponentProps> = (props) => {
    const { cell, rerender } = props;

    const [color, setColor] = useState<ButtonOwnProps["color"]>("info");

    return (
        <Button
            variant="contained"
            color={color}
            onClick={() => {
                // cell.properties.selected = !cell.properties.selected;
                // setSelected(cell);

                // Reload the grid
                rerender();
            }}
            style={{
                margin: "10px",
                width: "50px",
                height: "50px",
            }}
        >
            {cell.properties.cell.cellType.character}
        </Button>
    );
};

interface GridCellProps {
    // render: number;
    // setRender: React.Dispatch<React.SetStateAction<number>>;
    rerender: () => void;
}

/**
 * @returns The grid component.
 * @param props - The properties of the grid component.
 */
const GridVisuals: React.FC<GridCellProps> = (props) => {
    const { rerender } = props;

    // The selected cell
    const [selected, setSelected] = useState<GridCell<QAGridCell> | null>(null);

    return (<>
        <h3>Grid</h3>
        {/* Grid component */}
        <GridComponent container spacing={0}>
            {/* For each cell, map a component */}
            {quantumAssembler.grid.cells.map((row, rowIndex) => (
                <GridComponent item key={rowIndex} xs={12}>
                    {row.map((cell, cellIndex) => (
                        <GridCellComponent
                            key={cellIndex}
                            cell={cell}
                            rerender={rerender}
                        />
                    ))}
                </GridComponent>
            ))}
        </GridComponent>
    </>);
};

export default GridVisuals;
export { GridVisuals, GridCellComponent };
// export type { GridCellProps };
