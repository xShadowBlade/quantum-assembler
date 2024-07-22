/**
 * @file Visuals for the grid
 */
import React, { useEffect, useState } from "react";
import type { ButtonOwnProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import GridComponent from "@mui/material/Grid";
// import Box from "@mui/material/Box";
import type { GridCell, GridDirectionCell } from "emath.js";

import { quantumAssembler } from "../../game/quantumAssembler/quantumAssembler";
import type { QAGridCell } from "../../game/quantumAssembler/quantumAssembler";
import { createCellThemeKey } from "../../game/quantumAssembler/cellTypeColors";
import type { CellColorOverrideKey } from "../../game/quantumAssembler/cellTypeColors";

import { cellTypes } from "../../game/quantumAssembler/cellTypes";
import type { QACell } from "../../game/quantumAssembler/qaCell";

import { useGameState } from "../../gameStateContext";

const directions: Record<GridDirectionCell, string> = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
};

/**
 * The properties of the grid cell component.
 */
interface GridCellComponentProps {
    cell: QACell;
    onClick?: () => void;
}

// TODO: Refactor this
/**
 * @returns The grid cell component.
 * @param props - The properties of the grid cell component.
 */
const GridCellComponent: React.FC<GridCellComponentProps> = (props) => {
    const { cell } = props;

    const gameState = useGameState();

    const { theme, selectedCoords } = gameState;

    const [color, setColor] = useState<ButtonOwnProps["color"]>(createCellThemeKey("void"));

    const getColor = (shade?: false): CellColorOverrideKey => createCellThemeKey(cell.cellType.type);

    // TODO: Fix this
    const getBorderColor = (): string => {
        const borderColor = theme.palette[getColor()];

        // If the cell is selected, make the border color darker
        const isSelected = cell.x === selectedCoords[0] && cell.y === selectedCoords[1];

        // return isSelected ? borderColor.dark : borderColor.main;

        if (isSelected) {
            console.log("Selected", cell.x, cell.y, selectedCoords, borderColor.dark, { borderColor });
            return borderColor.dark;
            // return "primary";
        } else {
            return borderColor.main;
            // return "secondary";
        }
    };

    // TODO: Better way to set the style
    // const [style, setStyle] = useState<React.CSSProperties>({
    //     // borderRadius: 0,
    //     // border: 5,
    //     // borderColor: getBorderColor(),
    //     // get borderColor () {
    //     //     // console.log("Getting border color", cell.x, cell.y);
    //     //     return getBorderColor();
    //     // },
    // });

    // On render, set the color
    useEffect(() => {
        // TODO: fix rerenders
        // console.log("Setting color", cell.x, cell.y, getColor());
        setColor(getColor());
    }, []);

    return (
        <Button
            className="m-2 w-14 h-14"
            variant="contained"
            color={color}
            onClick={props.onClick ?? (() => {

                switch (gameState.cellSelectMode) {
                    case "select":
                        gameState.set("selectedCoords", [cell.x, cell.y]);
                        break;
                    // case "place":
                    //     quantumAssembler.setCell(cell.x, cell.y, "basic", 1, "up");
                    //     break;
                    case "rotate":
                        quantumAssembler.rotateCell(cell.x, cell.y, gameState.cellRotationDirection);
                        break;
                    case "remove":
                        quantumAssembler.setCell(cell.x, cell.y);
                        break;
                }

                // Reload the grid
                gameState.rerender();
                quantumAssembler.reloadGrid();
            })}
        >
            {cell.cellType.character} {directions[cell.direction]}
        </Button>
    // </Box>
    );
};

/**
 * @returns The grid component.
 */
const GridVisuals: React.FC = () => {

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
                            cell={cell.properties.cell}
                        />
                    ))}
                </GridComponent>
            ))}
        </GridComponent>

        <hr />

        {/* List of all buttons (debug) */}
        {/* <h4>Buttons</h4>
        {cellTypes.map((cellType) => (
            <Button
                key={cellType.type}
                variant="contained"
                color={createCellThemeKey(cellType.type)}
                // style={{
                //     margin: "10px",
                //     width: "50px",
                //     height: "50px",
                // }}
                className="m-5 w-12 h-12"
                // onClick={() => {
                //     console.log("Selected", cellType.type);
                //     props.setSelectedCellType(cellType.type);
                // }}
            >
                {cellType.character}
            </Button>
        ))} */}

        <hr />
    </>);
};

export default GridVisuals;
export { GridVisuals, GridCellComponent };
// export type { GridCellProps };
