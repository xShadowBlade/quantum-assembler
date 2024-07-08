/**
 * @file Declares the quantum assembler feature (basically reactor grid)
 */
import { Grid, Decimal } from "emath.js";
import type { GridCell, UpgradeInit } from "emath.js";
import { Expose, Type } from "class-transformer";
import { Game } from "./game";

/**
 * Gets all cells of a specific type from the quantum assembler grid
 * @param type The type of the cells
 * @returns The cells of the specified type
 */
function getCellTypeFromGrid (type: QACellType): QACell[] {
    const grid = quantumAssemblerGrid.value;
    const cells = grid.getAll().filter(cell => cell.properties.cell.type === type);
    return cells.map(cell => cell.properties.cell);
}

/**
 * @returns Whether the grid is valid
 */
function isGridValid (): boolean {
    // Check special cells
    const specialCells = cellTypes.filter((cell) => "special" in cell && cell.special);

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
 * Represents a cell in the quantum assembler grid
 */
interface QAGridCell {
    cell: QACell;
}

interface QACellStaticSpawner {
    /**
     * The type of the cell
     */
    type: string;

    /**
     * The upgrade of the cell
     */
    upgrade: Readonly<Omit<UpgradeInit, "id" | "effect">>;

    /**
     * The effect of the cell
     * @param cell - The cell
     * @param grid - The grid
     */
    effect?: (cell: QACell, grid: Grid<QAGridCell>) => void;

    /**
     * Whether the cell is special (only one can be placed in the grid)
     * @default false
     */
    special?: boolean;

    /**
     * The image of the cell
     */
    image?: string;
}

/**
 * Represents a cell type in the quantum assembler grid
 */
class QACell {
    /** The type of the cell */
    @Expose()
    public type: QACellType;

    /** The tier of the cell */
    @Type(() => Decimal)
    public tier: Decimal;

    /** The grid cell of the cell */
    public gridCell: GridCell<QAGridCell>;

    /**
     * Initializes a new instance of the QACell class
     * @param type The type of the cell
     * @param tier The tier of the cell
     * @param gridCell The grid cell of the cell
     */
    constructor (type: QACellType, tier: Decimal, gridCell: GridCell<QAGridCell>) {
        this.type = type;
        this.tier = tier;

        this.gridCell = gridCell;
    }
}

// TODO: Add images, costs
/**
 * The types of cells in the quantum assembler grid
 */
const cellTypes = [
    {
        type: "void",
        upgrade: {
            name: "Void",
            description: "Does nothing.",
            cost: (): Decimal => Decimal.dZero,
            // effect: (): void => {},
        },
        image: "",
    },
    {
        type: "charm",
        upgrade: {
            name: "Charm Quark: starts assembler.",
            description: "Generates charm.",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "up",
        upgrade: {
            name: "Up Quark",
            description: "Up Quark: increases value by (TODO) and instability by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "down",
        upgrade: {
            name: "Down Quark",
            description: "Down Quark: decreases instability by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "strange",
        upgrade: {
            name: "Strange Quark",
            description: "Strange Quark: ends the assembler.",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "top",
        upgrade: {
            name: "Top Quark",
            description: "Top Quark: Increases the pointing up quark's value by (TODO) and increases instability by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },

    // special (1 max per grid)
    {
        type: "graviton",
        special: true,
        upgrade: {
            name: "Graviton",
            description: "Graviton (special): increases the effect of all cells by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "higgs boson",
        special: true,
        upgrade: {
            name: "Higgs Boson",
            description: "Higgs Boson (special): increases the value by ^2 (TODO)",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "z boson",
        special: true,
        upgrade: {
            name: "Z Boson",
            description: "Z Boson (special): increases the value of all cells by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "w boson",
        special: true,
        upgrade: {
            name: "W Boson",
            description: "W Boson (special): decreases the instability of all cells by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },

    // super special
    // {
    //     type: "test",
    //     special: true,
    //     upgrade: {
    //         name: "Test",
    //         description: "Test (special): all cells are adjacent to one another.",
    //         cost: (): Decimal => Decimal.dZero,
    //     },
    // },
] as const satisfies QACellStaticSpawner[];

type QACellType = typeof cellTypes[number]["type"];

const quantumAssemblerGrid = Game.dataManager.setData("quantumAssemblerGrid",
    new Grid<QAGridCell>(5, 5,
        (gridCell) => ({
            cell: new QACell("void", Decimal.dZero, gridCell),
        }),
    ),
);

export { QACell, quantumAssemblerGrid, cellTypes };
