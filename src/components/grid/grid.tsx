/**
 * @file Visuals for the grid
 */
import React, { useEffect, useState } from "react";
import type { ButtonOwnProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import GridComponent from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Grid, GridCell, GridCellCollection, GridDirectionCell } from "emath.js";

import { quantumAssembler } from "../../game/quantumAssembler/quantumAssembler";
import type { QAGridCell, RotateDirection } from "../../game/quantumAssembler/quantumAssembler";
import { createCellThemeKey } from "../../game/quantumAssembler/cellTypeColors";
import type { CellColorOverrideKey } from "../../game/quantumAssembler/cellTypeColors";

import type { Theme } from "@mui/material/styles";
import { cellTypes } from "../../game/quantumAssembler/cellTypes";
import type { CellSelectMode } from "../../app";

/**
 * The properties of the grid cell component.
 */
interface GridCellComponentProps {
    cell: GridCell<QAGridCell>;
    render: number;
    rerender: () => void;
    selectedCoords: [number, number];
    setSelectedCoords: React.Dispatch<React.SetStateAction<[number, number]>>;

    onClick?: () => void;

    theme: Theme;
    cellSelectMode: CellSelectMode;
    cellRotationDirection: RotateDirection;
}

const directions: Record<GridDirectionCell, string> = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
};

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
            onClick={props.onClick ?? (() => {
                // cell.properties.selected = !cell.properties.selected;
                // setSelected(cell);

                // Set the selected coordinates
                // setSelectedCoords([cell.x, cell.y]);

                switch (props.cellSelectMode) {
                    case "select":
                        setSelectedCoords([cell.x, cell.y]);
                        break;
                    // case "place":
                    //     quantumAssembler.setCell(cell.x, cell.y, "basic", 1, "up");
                    //     break;
                    case "rotate":
                        quantumAssembler.rotateCell(cell.x, cell.y, props.cellRotationDirection);
                        break;
                    case "remove":
                        quantumAssembler.setCell(cell.x, cell.y);
                        break;
                }

                // Reload the grid
                // rerender();
                props.rerender();
                quantumAssembler.reloadGrid();
            })}
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
            {cell.properties.cell.cellType.character} {directions[cell.properties.cell.direction]}
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
                            cellSelectMode={props.cellSelectMode}
                            cellRotationDirection={props.cellRotationDirection}
                            // props={{
                            //     cell,
                            //     ...props,
                            // }}
                        />
                    ))}
                </GridComponent>
            ))}
        </GridComponent>

        <hr />

        {/* List of all buttons (debug) */}
        <h4>Buttons</h4>
        {cellTypes.map((cellType) => (
            <Button
                key={cellType.type}
                variant="contained"
                color={createCellThemeKey(cellType.type)}
                style={{
                    margin: "10px",
                    width: "50px",
                    height: "50px",
                }}
                // onClick={() => {
                //     console.log("Selected", cellType.type);
                //     props.setSelectedCellType(cellType.type);
                // }}
            >
                {cellType.character}
            </Button>
        ))}

        <hr />
    </>);
};

export default GridVisuals;
export { GridVisuals, GridCellComponent };
// export type { GridCellProps };
