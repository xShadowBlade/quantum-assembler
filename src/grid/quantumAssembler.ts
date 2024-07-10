/**
 * @file Declares the quantum assembler feature (basically reactor grid)
 */
import { Grid, GridCellCollection, Decimal } from "emath.js";
import type { GridCell, GridDirectionCell } from "emath.js";
import { Exclude, Expose, Type } from "class-transformer";
import { Game } from "../game";
import { cellTypes } from "./cellTypes";
import type { QACellType, QACellStaticSpawner } from "./cellTypes";
import { energy } from "./energy";

/**
 * Gets all cells of a specific type from the quantum assembler grid
 * @param type The type of the cells
 * @returns The cells of the specified type
 */
function getCellTypeFromGrid (type: QACellType): QACell[] {
    const grid = quantumAssemblerGrid.value;

    // Get all cells of the specified type
    const cells = grid.getAll().filter(cell => cell.properties.cell.type === type);

    return cells.map(cell => cell.properties.cell);
}

/**
 * @returns Whether the grid is valid
 */
function isGridValid (): boolean {
    // Check special cells
    const specialCells = cellTypes.filter((cell) => "special" in cell && (cell.special as boolean));

    specialCells.forEach((cell) => {
        const cells = getCellTypeFromGrid(cell.type);

        // If there are more than one special cell, the grid is invalid
        if (cells.length > 1) {
            return false;
        }
    });

    // Otherwise, the grid is valid
    return true;
}

/**
 * Cell properties in the quantum assembler grid
 */
interface QAGridCell {
    cell: QACell;
}

/**
 * Represents a cell class in the quantum assembler grid
 */
class QACell {
    /** The type of the cell */
    @Expose()
    public type: QACellType;

    /** @returns The cell type */
    @Exclude()
    public get cellType (): QACellStaticSpawner {
        return cellTypes.find((cell) => cell.type === this.type) as QACellStaticSpawner;
    }

    /** The direction of the cell */
    public direction: GridDirectionCell;

    /** The tier of the cell */
    @Type(() => Decimal)
    public tier: Decimal;

    /** The grid cell of the cell */
    @Exclude()
    // public gridCell: GridCell<QAGridCell>;

    private x: number;
    private y: number;

    /** @returns The grid cell of the cell */
    public get gridCell (): GridCell<QAGridCell> {
        return quantumAssemblerGrid.value.getCell(this.x, this.y);
    }

    /**
     * Gets the facing direction of the cell. Includes effects like gluon
     * @returns The facing direction of the cell
     */
    public getFacingDirection (): GridCellCollection<QAGridCell> {
        const grid = quantumAssemblerGrid.value;

        // If the grid has a singularity, return all cells (excluding itself)
        if (getCellTypeFromGrid("singularity").length > 0) {
            return new GridCellCollection(grid.getAll().filter(cell => cell.x !== this.x && cell.y !== this.y));
        }

        // If the grid has a gluon, return the adjacent cells
        if (getCellTypeFromGrid("gluon").length > 0) {
            return grid.getAdjacent(this.x, this.y);
        }

        // Otherwise, return the direction
        return new GridCellCollection(this.gridCell.direction(this.direction));
    }

    /**
     * Initializes a new instance of the QACell class
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param gridCell The grid cell of the cell
     * @param direction The direction of the cell
     */
    constructor (type: QACellType, tier: Decimal, gridCell: GridCell<QAGridCell>, direction: GridDirectionCell = "up") {
        this.type = type;
        this.tier = tier;

        // this.gridCell = gridCell;
        this.x = gridCell.x;
        this.y = gridCell.y;
        this.direction = direction;
    }
}

/**
 * The grid of the quantum assembler
 */
const quantumAssemblerGrid = Game.dataManager.setData("quantumAssemblerGrid",
    new Grid<QAGridCell>(7, 7,
        (gridCell) => ({
            cell: new QACell("void", Decimal.dZero, gridCell),
        }),
    ),
);

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        quantumAssemblerGrid: quantumAssemblerGrid.value,
        getCellTypeFromGrid,
        isGridValid,
    });
}

export { QACell, quantumAssemblerGrid, getCellTypeFromGrid, isGridValid };
export type { QAGridCell };
