/**
 * @file Declares the quantum assembler feature (basically reactor grid)
 */
import { Grid, GridCellCollection, Decimal, AttributeStatic } from "emath.js";
import type { GridCell, GridDirectionCell, DecimalSource } from "emath.js";
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
    const grid = quantumAssemblerGrid;

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
 * Reloads the quantum assembler grid
 */
function reloadGrid (): void {
    // Run the effect of all cells
    quantumAssemblerGrid.getAll().forEach((cell) => {
        cell.properties.cell.effect();
    });
}

/**
 * Sets a cell in the quantum assembler grid
 * @param x The x-coordinate of the cell
 * @param y The y-coordinate of the cell
 * @param type The type of the cell
 * @param tier The tier of the cell
 * @param direction The direction of the cell
 */
function setCell (x: number, y: number, type: QACellType, tier: DecimalSource = 1, direction: GridDirectionCell = "up"): void {
    tier = new Decimal(tier);

    // const grid = quantumAssemblerGrid;
    // const gridCell = grid.get(x, y);

    // const newCell = new QACell(x, y, type, tier, direction);
    // gridCell.properties.cell = newCell;

    // Set the cell data
    Game.dataManager.setData(getCellId(x, y), new QACellData(x, y, type, tier, direction));

    // reloadGrid();
}

type CellId = `quantumAssemblerGrid.${number}.${number}.cell`;

/**
 * Gets the cell ID of a cell in the quantum assembler grid
 * @param x The x-coordinate of the cell
 * @param y The y-coordinate of the cell
 * @returns The cell ID
 */
function getCellId (x: number, y: number): CellId {
    return `quantumAssemblerGrid.${x}.${y}.cell`;
}

// TODO: Make static and data classes of QACell

/**
 * Represents the data of a cell in the quantum assembler grid
 */
class QACellData {
    /** The type of the cell */
    @Expose()
    public type: QACellType;

    /** The direction of the cell */
    @Expose()
    public direction: GridDirectionCell;

    /** The tier of the cell */
    @Type(() => Decimal)
    public tier: Decimal;

    /** The x-coordinate of the cell */
    @Expose()
    public x: number;

    /** The y-coordinate of the cell */
    @Expose()
    public y: number;

    /**
     * Initializes a new instance of the QACellData class
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param direction The direction of the cell
     */
    constructor (x: number, y: number, type: QACellType, tier: Decimal, direction: GridDirectionCell) {
        this.type = type;
        this.direction = direction;
        this.tier = tier;
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents a cell class in the quantum assembler grid.
 * This class can represent any type of cell. The type of the cell is stored in the data property.
 */
class QACell {
    /** The type of the cell */
    // @Expose()
    // public type: QACellType;

    /** @returns The cell type */
    public get cellType (): QACellStaticSpawner {
        return cellTypes.find((cell) => cell.type === this.data.type) as QACellStaticSpawner;
    }

    /** The x-coordinate of the cell */
    public x: number;

    /** The y-coordinate of the cell */
    public y: number;

    /**
     * @returns The data of the cell
     */
    private get data (): QACellData {
        // Get the data from the data manager
        const data = Game.dataManager.getData(getCellId(this.x, this.y));

        // If the data is undefined, create a new instance of QACellData
        if (data === undefined) {
            const newData = new QACellData(this.x, this.y, "void", Decimal.dZero, "up");
            Game.dataManager.setData(getCellId(this.x, this.y), newData);
            return newData;
        }

        // Return the data
        if (data instanceof QACellData) {
            return data;
        } else {
            // This should never happen
            console.error("Cell data is not an instance of QACellData", data);
            console.log(data);
            return new QACellData(this.x, this.y, "void", Decimal.dZero, "up");
        }
    }

    /** @returns The type of the cell */
    public get type (): QACellType {
        return this.data.type;
    }

    /** @returns The direction of the cell */
    public get direction (): GridDirectionCell {
        return this.data.direction;
    }

    /** @returns The tier of the cell */
    public get tier (): Decimal {
        // return this.data.tier;

        const tierToReturn = this.data.tier as Decimal | { sign: number; layer: number; mag: number; };

        // Sometimes when serializing, the tier is not a Decimal. This is a workaround.
        if (tierToReturn instanceof Decimal) {
            return tierToReturn;
        } else {
            console.warn("Tier is not a Decimal", tierToReturn);
            return Decimal.fromComponents(tierToReturn.sign, tierToReturn.layer, tierToReturn.mag);
        }
    }

    /** @returns The grid cell of the cell */
    public get gridCell (): GridCell<QAGridCell> {
        return quantumAssemblerGrid.getCell(this.x, this.y);
    }

    /**
     * The energy energy generation of the cell.
     * It is an attribute so it can be affected by boosts such as up quarks.
     */
    @Type(() => AttributeStatic)
    public generation: AttributeStatic = new AttributeStatic(undefined, true, Decimal.dZero);

    /**
     * The instability generation of the cell.
     * It is an attribute so it can be affected by boosts such as down quarks.
     */
    @Type(() => AttributeStatic)
    public instability: AttributeStatic = new AttributeStatic(undefined, true, Decimal.dZero);

    /**
     * Gets the facing direction of the cell. Includes effects like gluon
     * @returns The facing direction of the cell
     */
    public getFacingDirection (): QACell[] {
        const grid = quantumAssemblerGrid;

        // If the grid has a singularity, return all cells (excluding itself)
        if (getCellTypeFromGrid("singularity").length > 0) {
            return grid.getAll().filter(cell => cell.x !== this.x && cell.y !== this.y)
                .map(cell => cell.properties.cell);
        }

        // If the grid has a gluon, return the adjacent cells
        if (getCellTypeFromGrid("gluon").length > 0) {
            return grid.getAdjacent(this.x, this.y)
                .map(cell => cell.properties.cell);
        }

        // Otherwise, return the direction
        return [this.gridCell.direction(this.direction).properties.cell];
    }

    /**
     * Runs the effect of the cell
     */
    public effect (): void {
        this.cellType.effect?.(this.tier, this, quantumAssemblerGrid);
    }

    /**
     * Initializes a new instance of the QACell class
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param direction The direction of the cell
     */
    // constructor (x: number, y: number, type: QACellType, tier: Decimal, direction: GridDirectionCell = "up") {
    constructor (x: number, y: number) {
        // this.type = type;
        // this.tier = tier;

        this.x = x;
        this.y = y;
        // this.direction = direction;
    }
}

/**
 * The grid of the quantum assembler
 */
const quantumAssemblerGrid = new Grid<QAGridCell>(7, 7, (gridCell) => {
    // cell: new QACell("void", Decimal.dZero, gridCell),
    // get cell (): QACell {
    //     // Get the cell from the grid cell data
    //     const cellFromData = Game.dataManager.getData(`quantumAssemblerGrid.${gridCell.x}.${gridCell.y}.cell`);

    //     // If the cell is undefined, create a new void cell and set it
    //     if (cellFromData === undefined) {
    //         const newCell = new QACell(gridCell.x, gridCell.y, "void", Decimal.dZero);
    //         Game.dataManager.setData(`quantumAssemblerGrid.${gridCell.x}.${gridCell.y}.cell`, newCell);
    //         return newCell;
    //     }

    //     // Return the cell
    //     if (cellFromData instanceof QACell) {
    //         return cellFromData;
    //     } else {
    //         // This should never happen
    //         console.error("Cell data is not an instance of QACell", cellFromData);
    //         console.log(cellFromData);
    //         return new QACell(gridCell.x, gridCell.y, "void", Decimal.dZero);
    //     }
    // },

    // set cell (value: QACell) {
    //     // Set the cell
    //     console.log("Setting cell", value);
    //     Game.dataManager.setData(`quantumAssemblerGrid.${gridCell.x}.${gridCell.y}.cell`, value);
    // },

    // cell: new QACell(gridCell.x, gridCell.y),

    // Set the cell to void by default
    Game.dataManager.setData(getCellId(gridCell.x, gridCell.y), new QACellData(gridCell.x, gridCell.y, "void", Decimal.dZero, "up"));

    return {
        cell: new QACell(gridCell.x, gridCell.y),
    };
});

// Reload the grid
reloadGrid();

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        quantumAssemblerGrid,
        getCellTypeFromGrid,
        isGridValid,
        reloadGrid,
        setCell,
    });
}

export { QACell, QACellData, quantumAssemblerGrid, getCellTypeFromGrid, isGridValid, reloadGrid, setCell };
export type { QAGridCell };
