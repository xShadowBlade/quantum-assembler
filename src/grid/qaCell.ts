/**
 * @file Declares the quantum assembler feature (basically reactor grid)
 */
import { Decimal, AttributeStatic } from "emath.js";
import type { GridCell, GridDirectionCell } from "emath.js";
import { Expose, Type } from "class-transformer";
import { Game } from "../game";
import { cellTypes } from "./cellTypes";
import type { QACellType, QACellStaticSpawner, QACellEntry } from "./cellTypes";

import { quantumAssembler } from "./quantumAssembler";
import type { QAGridCell } from "./quantumAssembler";

/**
 * The cell ID of a cell in the quantum assembler grid data
 */
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
    @Expose()
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
    /** @returns The cell type */
    public get cellType (): QACellEntry {
        return cellTypes.find((cell) => cell.type === this.data.type) ?? cellTypes[0];
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

        const tierToReturn = this.data.tier as Decimal | { sign: number; layer: number; mag: number };

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
        return quantumAssembler.grid.getCell(this.x, this.y);
    }

    /**
     * The energy energy generation of the cell.
     * It is an attribute so it can be affected by boosts such as up quarks.
     */
    public generation: AttributeStatic = new AttributeStatic(undefined, true, Decimal.dZero);

    /**
     * The instability generation of the cell.
     * It is an attribute so it can be affected by boosts such as down quarks.
     */
    public instability: AttributeStatic = new AttributeStatic(undefined, true, Decimal.dZero);

    /**
     * Initializes a new instance of the QACell class
     * @param x The x-coordinate of the cell
     * @param y The y-coordinate of the cell
     */
    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Gets the direction the cell is pointing to.
     * @returns The direction the cell is pointing to.
     */
    public getDirectionCellPointedTo (): GridDirectionCell | "adjacent" | "all" {
        // If the grid has a singularity, return all
        if (quantumAssembler.hasCellType("singularity")) {
            return "all";
        }

        // If the grid has a gluon, return the adjacent cells
        if (quantumAssembler.hasCellType("gluon")) {
            return "adjacent";
        }

        // Otherwise, return the direction
        return this.direction;
    }

    /**
     * Gets the facing direction of the cell. Includes effects like gluon
     * @returns The facing direction of the cell
     */
    public getFacingDirection (): QACell[] {
        const grid = quantumAssembler.grid;

        const facingDirection = this.getDirectionCellPointedTo();

        switch (facingDirection) {
            case "all":
                return grid.getAll().filter(cell => cell.x !== this.x && cell.y !== this.y)
                    .map(cell => cell.properties.cell);
            case "adjacent":
                return grid.getAdjacent(this.x, this.y)
                    .map(cell => cell.properties.cell);
            default:
                return [this.gridCell.direction(this.direction).properties.cell];
        }
    }

    /**
     * Runs the effect of the cell
     */
    public effect (): void {
        // this.cellType.effect?.(this.tier, this, quantumAssembler.grid);

        // if ("effect" in this.cellType) {
        //     (this.cellType as QACellStaticSpawner).effect(this.tier, this, quantumAssembler.grid);
        // }

        (this.cellType as QACellStaticSpawner).effect?.(this.tier, this, quantumAssembler.grid);
    }
}

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        // getCellTypeFromGrid,
        // isGridValid,
        // reloadGrid,
        // setCell,
        // buyCell,
    });
}

export { QACell, QACellData, getCellId };
export type { CellId };
