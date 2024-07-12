/**
 * @file Visuals for the grid
 */
import React, { useEffect, useState } from "react";
import type { ButtonOwnProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import GridComponent from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Grid, GridCell, GridCellCollection } from "emath.js";

import { quantumAssembler } from "./grid/quantumAssembler";
import type { QAGridCell } from "./grid/quantumAssembler";
import { createCellThemeKey } from "./grid/cellTypeColors";
import type { CellColorOverrideKey } from "./grid/cellTypeColors";

import type { Theme } from "@mui/material/styles";

/**
 * The properties of the grid cell component.
 */
interface GridCellComponentProps {
    cell: GridCell<QAGridCell>;
    render: number;
    rerender: () => void;
    selectedCoords: [number, number];
    setSelectedCoords: React.Dispatch<React.SetStateAction<[number, number]>>;

    theme: Theme;
}

const GridCellComponent: React.FC<GridCellComponentProps> = (props) => {
    const { cell, setSelectedCoords, theme } = props;

    const [color, setColor] = useState<ButtonOwnProps["color"]>(createCellThemeKey("void"));

    const getColor = (shade?: false): CellColorOverrideKey => createCellThemeKey(cell.properties.cell.cellType.type);

    // TODO: Fix this
    const getBorderColor = (): string => {
        const borderColor = theme.palette[getColor()];

        // If the cell is selected, make the border color darker
        const isSelected = cell.x === props.selectedCoords[0] && cell.y === props.selectedCoords[1];

        // return isSelected ? borderColor.dark : borderColor.main;

        if (isSelected) {
            console.log("Selected", cell.x, cell.y, props.selectedCoords, borderColor.dark, { borderColor });
            return borderColor.dark;
            // return "primary";
        } else {
            return borderColor.main;
            // return "secondary";
        }
    };

    // TODO: Better way to set the style
    const [style, setStyle] = useState<React.CSSProperties>({
        // borderRadius: 0,
        // border: 5,
        // borderColor: getBorderColor(),
        // get borderColor () {
        //     // console.log("Getting border color", cell.x, cell.y);
        //     return getBorderColor();
        // },
    });

    // On render, set the color
    useEffect(() => {
        // console.log("Setting color", cell.x, cell.y, getColor());
        setColor(getColor());

        // setStyle({
        //     borderRadius: 0,
        //     border: 5,
        //     borderColor: getBorderColor(),
        // });
    }, [props.render]);

    return (
    // <Box
    //     // style={{
    //     //     border: "5px solid",
    //     //     borderColor: getBorderColor(),
    //     //     width: "50px",
    //     //     height: "50px",
    //     //     margin: "10px",
    //     // }}
    //     height={50}
    //     width={50}
    //     border={5}
    //     borderColor={getBorderColor()}
    //     margin={1}
    // >
        <Button
            variant="contained"
            color={color}
            onClick={() => {
                // cell.properties.selected = !cell.properties.selected;
                // setSelected(cell);

                // Set the selected coordinates
                setSelectedCoords([cell.x, cell.y]);

                // Reload the grid
                // rerender();
                props.rerender();
            }}
            style={{
                margin: "10px",
                width: "50px",
                height: "50px",
                // borderRadius: "0",
                // border: "5px solid",
                // borderColor: getBorderColor(),
            }}
            sx={style}
        >
            {cell.properties.cell.cellType.character}
        </Button>
    // </Box>
    );
};

type GridCellProps = Omit<GridCellComponentProps, "cell">

/**
 * @returns The grid component.
 * @param props - The properties of the grid component.
 */
const GridVisuals: React.FC<GridCellProps> = (props) => {

    // The selected cell
    // const [selected, setSelected] = useState<GridCell<QAGridCell> | null>(null);

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
                            render={props.render}
                            rerender={props.rerender}
                            selectedCoords={props.selectedCoords}
                            setSelectedCoords={props.setSelectedCoords}
                            theme={props.theme}
                            // props={{
                            //     cell,
                            //     ...props,
                            // }}
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
