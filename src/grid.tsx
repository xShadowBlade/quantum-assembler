/**
 * @file Visuals for the grid
 */
import React, { useEffect, useState } from "react";
import type { ButtonOwnProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import GridComponent from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Grid, GridCell, GridCellCollection } from "emath.js";

import { quantumAssemblerGrid } from "./quantumAssembler";

/**
 * The properties of a grid cell.
 */
interface GridCellProps {
    /**
     * Whether the cell is selected.
     */
    selected: boolean;

    /**
     * Whether the cell is highlighted.
     */
    highlighted: boolean;
}

// debug
Object.assign(window, { grid: quantumAssemblerGrid });

/**
 * The properties of the grid cell component.
 */
interface GridCellComponentProps {
    cell: GridCell<GridCellProps>;
    render: number;
    setRender: React.Dispatch<React.SetStateAction<number>>;
    // selected: GridCell<GridCellProps> | null;
    setSelected: (cell: GridCell<GridCellProps>) => void;
}

const GridCellComponent: React.FC<GridCellComponentProps> = ({ cell, render, setSelected, setRender }) => {
    const [color, setColor] = useState<ButtonOwnProps["color"]>("info");

    useEffect(() => {
        setColor(
            cell.properties.selected ? "primary"
                : cell.properties.highlighted ? "secondary"
                    : "warning",
        );
    }, [render]);

    return (
        <Button
            variant="contained"
            color={color}
            onClick={() => {
                // cell.properties.selected = !cell.properties.selected;
                setSelected(cell);
                setRender(render + 1);
            }}
            style={{
                margin: "5px",
                width: "50px",
                height: "50px",
            }}
        >
            {cell.x}, {cell.y}
        </Button>
    );
};

const cellMethods = [
    {
        name: "Adjacent",
        value: "getAdjacent",
    },
    {
        name: "Diagonal",
        value: "getDiagonal",
    },
    {
        name: "Encircling",
        value: "getEncircling",
    },
    {
        name: "All X",
        value: "getAllX",
    },
    {
        name: "All Y",
        value: "getAllY",
    },
] as const satisfies {
    name: string;
    value: keyof Grid<GridCellProps>;
}[];

type CellMethod = typeof cellMethods[number]["value"];

/**
 * @returns The grid component.
 */
const GridVisuals: React.FC = () => {
    // Rerender the grid
    const [render, setRender] = useState(0);

    // The selected cell
    const [selected, setSelected] = useState<GridCell<GridCellProps> | null>(null);

    // The highlighted cells
    const [highlighted, setHighlighted] = useState<GridCellCollection<GridCellProps> | null>(null);

    // The selected cell method
    const [method, setMethod] = useState<CellMethod>("getAdjacent");

    // Parameters for the selected cell method
    const [fill, setFill] = useState(false);
    const [distance, setDistance] = useState(1);

    const setSelectCell = (cell: GridCell<GridCellProps>): void => {
        // Deselect the previous cell
        if (selected) {
            // selected.properties.selected = false;
            selected.set("selected", false);
        }

        // Select the new cell
        setSelected(cell);

        // Highlight the selected cell
        // cell.properties.selected = true;
        cell.set("selected", true);

        // Rerender the grid
        setRender(render + 1);
    };

    useEffect(() => {
        // console.log(selected);

        if (selected) {
            // Unhighlight the previous cells
            if (highlighted) {
                highlighted.forEach((cell) => {
                    // cell.properties.highlighted = false;
                    cell.set("highlighted", false);
                });
            }

            // Highlight the new cells
            const cells = quantumAssemblerGrid[method](selected.x, selected.y, distance, fill);
            setHighlighted(cells);

            cells.forEach((cell) => {
                // cell.properties.highlighted = true;
                cell.set("highlighted", true);
            });
        }

        setRender(render + 1);
    }, [selected]);

    return (<>
        <h3>Grid</h3>
        {/* Grid component */}
        <GridComponent container spacing={2}>
            {/* For each cell, map a component */}
            {quantumAssemblerGrid.cells.map((row, rowIndex) => (
                <GridComponent item key={rowIndex} xs={12}>
                    {row.map((cell, cellIndex) => (
                        <GridCellComponent
                            key={cellIndex}
                            cell={cell}
                            render={render}
                            setRender={setRender}
                            setSelected={setSelectCell}
                        />
                    ))}
                </GridComponent>
            ))}
        </GridComponent>

        {/* Selected cell method */}
        <h3>Selected cell</h3>
        <FormControl>
            <FormLabel>Arguments</FormLabel>

            {/* Fill checkbox */}
            <FormControlLabel
                control={<Checkbox />}
                label="Fill (for distance methods)"
                onChange={(event) => {
                    setFill((event as React.ChangeEvent<HTMLInputElement>).target.checked);
                    setRender(render + 1);
                }}
            />

            {/* Distance slider */}
            <Slider
                defaultValue={1}
                min={1}
                max={5}
                step={1}
                valueLabelDisplay="auto"
                onChange={(_, value) => {
                    setDistance(value as number);
                    setRender(render + 1);
                }}
            />
            {/* <FormControlLabel
                control={<Slider
                    defaultValue={1}
                    min={1}
                    max={5}
                    step={1}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => {
                        setDistance(value as number);
                        setRender(render + 1);
                    }}
                />}
                label="Distance (for distance methods)"
            /> */}

            {/* Selected cell method radio */}
            <FormLabel>Selected cell method</FormLabel>
            <RadioGroup
                defaultValue={"getAdjacent"}
                // value={selected ? `${selected[0]}, ${selected[1]}` : ""}
                onChange={(event) => {
                    setMethod(event.target.value as CellMethod);
                    setRender(render + 1);
                }}
            >
                {cellMethods.map((method) => (
                    <FormControlLabel
                        key={method.value}
                        value={method.value}
                        control={<Radio />}
                        label={method.name}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    </>);
};

export default GridVisuals;
export { GridVisuals, GridCellComponent };
export type { GridCellProps };
