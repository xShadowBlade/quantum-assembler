/**
 * @file Declares the quantum assembler cell class.
 * It contains the data of a cell in the quantum assembler grid, {@link QACellData},
 * and the cell class, {@link QACell}.
 */
import { Decimal, AttributeStatic } from "emath.js";
import type { GridCell, GridDirectionCell } from "emath.js";
import { Expose, Type, instanceToPlain } from "class-transformer";
import { Game } from "../game";
import { cellTypes } from "./cellTypes";
import type { QACellType, QACellStaticSpawner, QACellEntry } from "./cellTypes";

import { quantumAssembler } from "./quantumAssembler";
import type { QAGridCell, QACellCoordinate } from "./quantumAssembler";
import { decimalDataToDecimal, decimalToDecimalData } from "../../utils/decimalData";
import type { DecimalData } from "../../utils/decimalData";

/**
 * The cell ID of a cell in the quantum assembler grid game data
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
 * The data of a cell in the quantum assembler grid
 */
// class QACellData {
//     /** The type of the cell */
//     @Expose()
//     public type: QACellType;

//     /** The direction of the cell */
//     @Expose()
//     public direction: GridDirectionCell;

//     /** The tier of the cell */
//     @Expose()
//     @Type(() => Decimal)
//     public tier: Decimal;

//     /** The x-coordinate of the cell */
//     @Expose()
//     public x: number;

//     /** The y-coordinate of the cell */
//     @Expose()
//     public y: number;

//     /**
//      * Initializes a new instance of the QACellData class
//      * @param x The x-coordinate of the cell
//      * @param y The y-coordinate of the cell
//      * @param type The type of the cell
//      * @param tier The tier of the cell
//      * @param direction The direction of the cell
//      */
//     constructor (x: number, y: number, type: QACellType, tier: Decimal, direction: GridDirectionCell) {
//         this.type = type;
//         this.direction = direction;
//         this.tier = tier;
//         this.x = x;
//         this.y = y;
//     }
// }

interface QACellGameData {
    /** The type of the cell */
    type: QACellType;

    /** The direction of the cell */
    direction: GridDirectionCell;

    /** The tier of the cell */
    tier: DecimalData;

    /** The x-coordinate of the cell */
    x: number;

    /** The y-coordinate of the cell */
    y: number;
}

/**
 * Creates a default quantum assembler cell game data
 * @param x - The x-coordinate of the cell
 * @param y - The y-coordinate of the cell
 * @returns The default quantum assembler cell game data
 */
const defaultQACellGameDataFactory = (x: number, y: number): QACellGameData => ({
    type: "void",
    direction: "up",
    tier: Decimal.dZero,
    x,
    y,
});

class QACellData implements Readonly<QACellGameData> {
    // public readonly tier: Decimal;
    // public readonly type: QACellType;
    // public readonly direction: GridDirectionCell;
    // public readonly x: number;
    // public readonly y: number;

    private gameDataFn: () => QACellGameData;
    public get gameData (): QACellGameData {
        return this.gameDataFn();
    }

    public get tier (): Decimal {
        return decimalDataToDecimal(this.gameData.tier);
    }
    public set tier (value: Decimal) {
        this.gameData.tier = decimalToDecimalData(value);
    }

    public get type (): QACellType { return this.gameData.type; }
    public set type (value: QACellType) { this.gameData.type = value; }

    public get direction (): GridDirectionCell { return this.gameData.direction; }
    public set direction (value: GridDirectionCell) { this.gameData.direction = value; }

    public get x (): number { return this.gameData.x; }
    public get y (): number { return this.gameData.y; }

    /**
     * Converts the game data to cell data
     * @param data The game data of the cell
     * @returns The cell data
     */
    constructor (gameDataFn: () => QACellGameData) {
        this.gameDataFn = gameDataFn;

        // this.x = x;
        // this.y = y;
        // this.type = type;
        // this.direction = direction;

        // // Handle tier
        // if (tier instanceof Decimal) {
        //     this.tier = tier;
        // } else {
        //     this.tier = decimalDataToDecimal(tier);
        // }
    }

    /**
     * Converts the cell data to game data
     * @returns The game data of the cell
     */
    public toGameData (): QACellGameData {
        return instanceToPlain(this) as QACellGameData;
    }
}

/**
 * An array of cell data in the quantum assembler grid.
 * Only used for serialization.
 */
class QACellDataArray {
    /**
     * Gets the data of a cell in the quantum assembler grid game data
     * @param x - The x-coordinate of the cell
     * @param y - The y-coordinate of the cell
     * @returns The data of the cell
     */
    public static getCell (x: number, y: number): QACellData {
        const coordinateKey: QACellCoordinate = `${x},${y}`;

        // Get the data from the static map
        const dataFromMap = QACellDataArray.qaCells.get(coordinateKey);

        // If the data exists, return it
        if (dataFromMap) {
            return dataFromMap;
        }

        // Else, get the data from the data manager
        const dataFromDataManager = (): QACellGameData => { 
            const data = gameDataQACellData.value.data[coordinateKey];
            if (data) return data;
            const defaultData = defaultQACellGameDataFactory(x, y);

            // Set the default data in the data manager
            gameDataQACellData.value.data[coordinateKey] = defaultData;

            return defaultData;
        };

        const data = new QACellData(dataFromDataManager);
        QACellDataArray.qaCells.set(coordinateKey, data);
        return data;
    }

    /**
     * Sets the data of a cell in the quantum assembler grid game data
     * @param x - The x-coordinate of the cell
     * @param y - The y-coordinate of the cell
     * @param data - The data of the cell
     */
    public static setCell (x: number, y: number, data: QACellGameData): void {
        // Set the data in the static map
        // QACellDataArray.qaCells.set(`${x},${y}`, data);

        // Set the data in the data manager
        gameDataQACellData.value.data[`${x},${y}`] = data;
    }

    /**
     * The map of cell data in the quantum assembler grid.
     * If the data is found in the map, it must be from the data manager.
     * If the data is not found in the map, it is fetched from the data manager.
     */
    public static qaCells = new Map<QACellCoordinate, QACellData>();

    /**
     * The data of the cells in the quantum assembler grid.
     */
    @Expose()
    // @Type(() => QACellData)
    // public data: QACellData[] = [];
    // public data = new Map<QACellCoordinate, QACellData | undefined>();
    public data: Record<QACellCoordinate, QACellGameData | undefined> = {};

    // get data (): Record<QACellCoordinate, QACellGameData | undefined> {
    //     return Object.fromEntries(QACellDataArray.qaCells.entries());
    // }
}

const gameDataQACellData = Game.dataManager.setData("quantumAssemblerGrid", new QACellDataArray());

/**
 * A cell class in the quantum assembler grid.
 * This class can represent any type of cell. The type of the cell is stored in the data property.
 */
class QACell {
    /** @returns The cell type */
    public get cellType (): QACellEntry {
        return cellTypes.find((cell) => cell.type === this.data.type) ?? cellTypes[0];
    }

    /** The x-coordinate of the cell */
    public readonly x: number;

    /** The y-coordinate of the cell */
    public readonly y: number;

    private dataFn: () => QACellData = () => QACellDataArray.getCell(this.x, this.y);

    /**
     * @returns The data of the cell
     */
    private get data (): QACellData {
        // Get the data from the data manager
        const data = QACellDataArray.getCell(this.x, this.y);

        // Return the data
        if (data instanceof QACellData) {
            return data;
        } else {
            // This should never happen
            throw new Error("Cell data is not an instance of QACellData");
        }
    }

    /** @returns The type of the cell */
    public get type (): QACellType {
        return this.data.type;
    }
    public set type (value: QACellType) {
        this.data.type = value;
    }

    /** @returns The direction of the cell */
    public get direction (): GridDirectionCell {
        return this.data.direction;
    }
    public set direction (value: GridDirectionCell) {
        this.data.direction = value;
    }

    /** @returns The tier of the cell */
    public get tier (): Decimal {
        const tierToReturn = this.data.tier as Decimal | { sign: number; layer: number; mag: number };

        // Sometimes when serializing, the tier is not a Decimal. This is a workaround.
        if (tierToReturn instanceof Decimal) {
            return tierToReturn;
        } else {
            // console.warn("Tier is not a Decimal", tierToReturn);
            return Decimal.fromComponents(tierToReturn.sign, tierToReturn.layer, tierToReturn.mag);
        }
    }
    public set tier (value: Decimal) {
        this.data.tier = value;
    }

    /** @returns The grid cell of the cell */
    public get gridCell (): GridCell<QAGridCell> {
        return quantumAssembler.grid.getCell(this.x, this.y);
    }

    /**
     * The energy energy generation of the cell.
     * It is an attribute so it can be affected by boosts such as up quarks.
     */
    public readonly generation = new AttributeStatic(undefined, true, Decimal.dZero);

    /**
     * The instability generation of the cell.
     * It is an attribute so it can be affected by boosts such as down quarks.
     */
    public readonly instability = new AttributeStatic(undefined, true, Decimal.dZero);

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

// For each cell type, create a "phantom" cell for displaying in the shop
// const phantomCells = cellTypes.map((cellType) => new QACell(0, 0));

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        QACell,
        QACellData,
        getCellId,
    });
}

export { QACell, QACellData, QACellDataArray, getCellId, gameDataQACellData };
export type { CellId };
