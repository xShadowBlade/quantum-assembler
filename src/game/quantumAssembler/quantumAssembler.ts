/**
 * @file Declares the quantum assembler grid class and inits it.
 */
import { Grid, Decimal } from "emath.js";
import type { DecimalSource, GridDirectionCell } from "emath.js";

import { Game } from "../game";
import { QACell, QACellData, getCellId, QACellDataArray } from "./qaCell";
import { cellTypes } from "./cellTypes";
import type { QACellType} from "./cellTypes";
import { energy, instability } from "../energy";

/**
 * The direction to rotate a cell.
 * `"cw"` for clockwise, `"ccw"` for counter-clockwise
 */
type RotateDirection = "cw" | "ccw";

/**
 * Cell properties in the quantum assembler grid
 */
interface QAGridCell {
    cell: QACell;
}

/**
 * The coordinate of a cell in the quantum assembler grid.
 * Used to identify a cell in the grid.
 */
type QACellCoordinate = `${number},${number}`;

/**
 * The quantum assembler grid class contains methods to interact with the quantum assembler grid, such as: setting cells, rotating cells, etc.
 * It contains the grid of the quantum assembler, which is a 7x7 grid of cells {@link QACell}.
 *
 * Use {@link quantumAssembler} to access the quantum assembler.
 */
class QuantumAssember {
    /**
     * The grid of the quantum assembler. It is a 7x7 grid of cells {@link QACell}.
     */
    public grid: Grid<QAGridCell>;

    /**
     * The initial size of the quantum assembler grid
     */
    public static readonly initialXSize = 2;

    /**
     * The initial size of the quantum assembler grid
     */
    public static readonly initialYSize = 2;

    /**
     * @returns The x size of the quantum assembler grid.
     */
    // public xSize = QuantumAssember.initialXSize;
    public get xSize (): number {
        return this.grid.xSize;
    }

    /**
     * @returns The y size of the quantum assembler grid.
     */
    // public ySize = QuantumAssember.initialYSize;
    public get ySize (): number {
        return this.grid.ySize;
    }

    /**
     * A collection of all cells in the quantum assembler grid.
     * It is seperated from the grid to allow for easier access to the cells, as well as to check for duplicates when the grid is resized.
     */
    // public static readonly qaCells: QACell[] = [];

    // public static readonly qaCellCoordinateSet = new Set<`${number},${number}`>();

    /**
     * Initializes a new instance of the QuantumAssember class
     * @param xSize The x-size of the grid
     * @param ySize The y-size of the grid
     */
    constructor (xSize = QuantumAssember.initialXSize, ySize = QuantumAssember.initialYSize) {
        // Set the size of the grid
        // this.xSize = xSize;
        // this.ySize = ySize;

        // Init the grid
        this.grid = new Grid<QAGridCell>(xSize, ySize, (gridCell) => {
            const cellId = getCellId(gridCell.x, gridCell.y);

            // Set the cell to void by default
            // Game.dataManager.setData(getCellId(gridCell.x, gridCell.y), new QACellData(gridCell.x, gridCell.y, "void", Decimal.dZero, "up"));

            // Get the cell data
            // const data = Game.dataManager.getData(cellId);
            const data = QACellDataArray.getCell(gridCell.x, gridCell.y);

            // If the data is undefined, create a new instance of QACellData
            // if (data === undefined) {
            //     const newData = new QACellData(gridCell.x, gridCell.y, "void", Decimal.dZero, "up");
            //     // Game.dataManager.setData(cellId, newData);
            //     QACellDataArray.setCell(gridCell.x, gridCell.y, newData);
            // }

            // Get the cell static
            // const cellCoordinates: QACellCoordinate = `${gridCell.x},${gridCell.y}`;

            // if (QuantumAssember.qaCellCoordinateSet.has(cellCoordinates)) {

            // }

            return {
                cell: new QACell(gridCell.x, gridCell.y),
            };
        });

        // Reload the grid
        this.reloadGrid();
    }

    /**
     * Resizes the quantum assembler grid
     * @param xSize The x-size of the grid
     * @param ySize The y-size of the grid
     */
    public resize (xSize: number, ySize: number): void {
        // this.xSize = xSize;
        // this.ySize = ySize;

        this.grid.resize(xSize, ySize);

        // Set the data for the quantum assembler size
        gameDataQASize.value = {
            x: xSize,
            y: ySize,
        };

        // Reload the grid
        this.reloadGrid();
    }

    /**
     * Gets the cell data from the quantum assembler grid
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     * @returns The cell data
     */
    public getCell (x: number, y: number): QACell {
        return this.grid.getCell(x, y).properties.cell;
    }

    /**
     * Gets all cells from the quantum assembler grid
     * @returns All cells
     */
    public getAllCells (): QACell[] {
        return this.grid.getAll().map(cell => cell.properties.cell);
    }

    /**
     * Sets a cell in the quantum assembler grid
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param direction The direction of the cell
     */
    public setCell (x: number, y: number, type: QACellType = "void", tier: DecimalSource = 1, direction: GridDirectionCell = "up"): void {
        tier = new Decimal(tier);

        // Set the cell data
        // Game.dataManager.setData(getCellId(x, y), new QACellData(x, y, type, tier, direction));

        QACellDataArray.setCell(x, y, { x, y, type, tier, direction });

        // Reload the grid
        this.reloadGrid();
    }

    /**
     * Buys the selected cell and sets it in the quantum assembler grid
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param direction The direction of the cell
     */
    public buyCell (x: number, y: number, type: QACellType, tier?: DecimalSource, direction?: GridDirectionCell): void {
        tier = new Decimal(tier);

        // Buy the cell
        const buyResult = energy.buyItem(type, tier, 1);

        if (!buyResult) {
            return;
        }

        // If the purchase was successful, set the selected cell
        this.setCell(x, y, type, tier, direction);
    }

    /**
     * Rotates a cell in the quantum assembler grid
     * @param x - The x-coordinate of the cell
     * @param y - The y-coordinate of the cell
     * @param direction - The direction to rotate the cell. `"cw"` for clockwise, `"ccw"` for counter-clockwise
     */
    public rotateCell (x: number, y: number, direction: GridDirectionCell | RotateDirection): void {
        const cell = this.getCell(x, y);

        // Set the direction of the cell
        switch (direction) {
            case "cw":
                // Rotate the cell clockwise
                cell.direction = cell.direction === "up" ? "right" : cell.direction === "right" ? "down" : cell.direction === "down" ? "left" : "up";
                break;
            case "ccw":
                // Rotate the cell counter-clockwise
                cell.direction = cell.direction === "up" ? "left" : cell.direction === "left" ? "down" : cell.direction === "down" ? "right" : "up";
                break;
            default:
                cell.direction = direction;
                break;
        }

        // Reload the grid
        this.reloadGrid();
    }

    /**
     * Gets all cells of a specific type from the quantum assembler grid
     * @param type The type of the cells
     * @returns The cells of the specified type
     */
    public getCellTypeFromGrid (type: QACellType): QACell[] {
        // Get all cells of the specified type
        const cells = this.grid.getAll().filter(cell => cell.properties.cell.type === type);

        return cells.map(cell => cell.properties.cell);
    }

    /**
     * Checks if the quantum assembler grid has a specific cell type
     * @param type The type of the cell
     * @returns Whether the grid has the specified cell type
     */
    public hasCellType (type: QACellType): boolean {
        return this.grid.getAll().some(cell => cell.properties.cell.type === type);
    }

    /**
     * @returns Whether the grid is valid
     */
    public isGridValid (): boolean {
        // Check special cells
        const specialCells = cellTypes.filter((cell) => "special" in cell && (cell.special as boolean));

        specialCells.forEach((cell) => {
            const cells = this.getCellTypeFromGrid(cell.type);

            // If there are more than one special cell, the grid is invalid
            if (cells.length > 1) {
                return false;
            }
        });

        // Otherwise, the grid is valid
        return true;
    }

    /**
     * Reloads the quantum assembler grid
     */
    public reloadGrid (): void {
        const allCells = this.getAllCells();

        // Clear the boosts of all cells and energy
        allCells.forEach((cell) => {
            cell.generation.boost.clearBoosts();
            cell.instability.boost.clearBoosts();
        });

        // Run the effect of all cells
        allCells.forEach((cell) => {
            cell.effect();
        });

        // If the grid is invalid, return
        if (!this.isGridValid()) {
            energy.boost.clearBoosts();
            instability.boost.clearBoosts();
            return;
        }

        // Calculate the energy
        allCells.forEach((cell) => {
            energy.boost.setBoost({
                id: `quantumAssemberGrid.${cell.x}.${cell.y}`,
                value: (x) => x.add(cell.generation.value),
                order: 1,
            });

            instability.boost.setBoost({
                id: `quantumAssemberGrid.${cell.x}.${cell.y}`,
                value: (x) => x.add(cell.instability.value),
                order: 1,
            });
        });
    }
}

// Create the quantum assembler
const quantumAssembler = new QuantumAssember();

// Set the data for the quantum assembler size
const gameDataQASize = Game.dataManager.setData("quantumAssemblerSize", { x: quantumAssembler.xSize, y: quantumAssembler.ySize });

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        quantumAssembler,
    });
}

export { QuantumAssember, quantumAssembler, gameDataQASize };
export type { QAGridCell, RotateDirection, QACellCoordinate };
