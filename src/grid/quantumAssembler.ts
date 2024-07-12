/**
 * @file Declares the quantum assembler grid class and inits it
 */
import { Grid, Decimal } from "emath.js";
import type { DecimalSource, GridDirectionCell } from "emath.js";

import { Game } from "../game";
import { QACell, QACellData, getCellId } from "./qaCell";
import { cellTypes } from "./cellTypes";
import type { QACellType} from "./cellTypes";
import { energy, instability } from "./energy";

/**
 * Cell properties in the quantum assembler grid
 */
interface QAGridCell {
    cell: QACell;
}

/**
 * The quantum assembler class.
 * Use {@link quantumAssembler} to access the quantum assembler.
 */
class QuantumAssember {
    /**
     * The grid of the quantum assembler
     */
    public grid: Grid<QAGridCell>;

    /**
     * Initializes a new instance of the QuantumAssember class
     */
    constructor () {
        // The size of the quantum assembler grid.
        const X_SIZE = 7;
        const Y_SIZE = 7;

        // Init the grid
        this.grid = new Grid<QAGridCell>(X_SIZE, Y_SIZE, (gridCell) => {
            // Set the cell to void by default
            Game.dataManager.setData(getCellId(gridCell.x, gridCell.y), new QACellData(gridCell.x, gridCell.y, "void", Decimal.dZero, "up"));

            return {
                cell: new QACell(gridCell.x, gridCell.y),
            };
        });
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
     * Sets a cell in the quantum assembler grid
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param direction The direction of the cell
     */
    public setCell (x: number, y: number, type: QACellType, tier: DecimalSource = 1, direction: GridDirectionCell = "up"): void {
        tier = new Decimal(tier);

        // Set the cell data
        Game.dataManager.setData(getCellId(x, y), new QACellData(x, y, type, tier, direction));

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
        // Run the effect of all cells
        this.grid.getAll().forEach((cell) => {
            cell.properties.cell.effect();
        });

        // Calculate the energy
        this.grid.getAll().forEach((cell) => {
            const QACell = cell.properties.cell;

            energy.boost.setBoost({
                id: `quantumAssemberGrid.${QACell.x}.${QACell.y}`,
                value: (x) => x.add(QACell.generation.value),
                order: 1,
            });

            instability.boost.setBoost({
                id: `quantumAssemberGrid.${QACell.x}.${QACell.y}`,
                value: (x) => x.add(QACell.instability.value),
                order: 1,
            });
        });
    }
}

// Reload the grid
const quantumAssembler = new QuantumAssember();

quantumAssembler.reloadGrid();

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        quantumAssembler,
    });
}

export { QuantumAssember, quantumAssembler };
export type { QAGridCell };
