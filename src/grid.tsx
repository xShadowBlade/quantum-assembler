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

import { quantumAssemblerGrid } from "./grid/quantumAssembler";
import type { QAGridCell } from "./grid/quantumAssembler";

/**
 * The properties of the grid cell component.
 */
interface GridCellComponentProps {
    cell: GridCell<QAGridCell>;
    render: number;
    setRender: React.Dispatch<React.SetStateAction<number>>;
    // selected: GridCell<GridCellProps> | null;
    // setSelected: (cell: GridCell<QAGridCell>) => void;
}

const GridCellComponent: React.FC<GridCellComponentProps> = ({ cell, render, setRender }) => {
    const [color, setColor] = useState<ButtonOwnProps["color"]>("info");

    return (
        <Button
            variant="contained"
            color={color}
            onClick={() => {
                // cell.properties.selected = !cell.properties.selected;
                // setSelected(cell);
                setRender(render + 1);
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

/**
 * @returns The grid component.
 */
const GridVisuals: React.FC = () => {
    // Rerender the grid
    const [render, setRender] = useState(0);

    // The selected cell
    const [selected, setSelected] = useState<GridCell<QAGridCell> | null>(null);

    return (<>
        <h3>Grid</h3>
        {/* Grid component */}
        <GridComponent container spacing={0}>
            {/* For each cell, map a component */}
            {quantumAssemblerGrid.cells.map((row, rowIndex) => (
                <GridComponent item key={rowIndex} xs={12}>
                    {row.map((cell, cellIndex) => (
                        <GridCellComponent
                            key={cellIndex}
                            cell={cell}
                            render={render}
                            setRender={setRender}
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
