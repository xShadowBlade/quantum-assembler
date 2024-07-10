/**
 * @file Declares the cell types for the grid.
 */
import { Decimal } from "emath.js";
import type { Grid, ItemInit, DecimalSource } from "emath.js";
import { Game } from "../game";
import type { QACell, QAGridCell } from "./quantumAssembler";

interface QACellStaticSpawner {
    /**
     * The type of the cell
     */
    type: string;

    /**
     * The display character of the cell
     * @example "C" for charm
     */
    character?: string;

    /**
     * The upgrade of the cell
     */
    upgrade: Readonly<Omit<ItemInit, "id">>;

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
 * The types of cells in the quantum assembler grid
 */
const cellTypes = [
    {
        type: "void",
        character: "V",
        upgrade: {
            name: "Void",
            description: "Does nothing.",
            cost: (): Decimal => Decimal.dZero,
        },
        // image: "",
    },
    {
        type: "charm",
        character: "C",
        upgrade: {
            name: "Charm Quark: starts assembler.",
            description: "Generates charm.",
            cost: (tier): Decimal => tier.pow(tier.plus(2.5)).round(),
            // effect:
        },
    },
    {
        type: "up",
        character: "U",
        upgrade: {
            name: "Up Quark",
            description: "Up Quark: increases value by (TODO) and instability by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(4).mul(1.25)).add(4).round(),
        },
    },
    {
        type: "down",
        character: "D",
        upgrade: {
            name: "Down Quark",
            description: "Down Quark: decreases instability by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(3.5).mul(1.25)).add(4).round(),
        },
    },
    {
        type: "strange",
        character: "S",
        upgrade: {
            name: "Strange Quark",
            description: "Strange Quark: ends the assembler.",
            cost: (tier): Decimal => tier.pow(tier.plus(3)).add(4).round(),
        },
    },
    {
        type: "top",
        character: "T",
        upgrade: {
            name: "Top Quark",
            description: "Top Quark: Increases the pointing up quark's value by (TODO) and increases instability by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(5).mul(1.5)).add(999).round(),
        },
    },

    // special (1 max per grid)
    {
        type: "graviton",
        character: "G",
        special: true,
        upgrade: {
            name: "Graviton",
            description: "Graviton (special): increases the effect of all cells by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(7).mul(2)).add(1e9 - 1).round(),
        },
    },
    {
        type: "higgs boson",
        character: "H",
        special: true,
        upgrade: {
            name: "Higgs Boson",
            description: "Higgs Boson (special): increases the value by ^2 (TODO)",
            cost: (tier): Decimal => tier.pow(tier.plus(10).mul(3)).add(1e15 - 1).round(),
        },
    },
    {
        type: "z boson",
        character: "Z",
        special: true,
        upgrade: {
            name: "Z Boson",
            description: "Z Boson (special): increases the value of all cells by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(15).mul(4)).add(1e30 - 1).round(),
        },
    },
    {
        type: "w boson",
        character: "W",
        special: true,
        upgrade: {
            name: "W Boson",
            description: "W Boson (special): decreases the instability of all cells by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(20).mul(5)).add(1e20 - 1).round(),
        },
    },
    {
        type: "gluon",
        character: "G",
        special: true,
        upgrade: {
            name: "Gluon",
            description: "Gluon (special): all cells are affect their adjacent cells regardless of direction.",
            cost: (): Decimal => new Decimal("1e25"),
        },
    },

    // super special
    // Singularity - Beat the game + all cells are adjacent to one another
    {
        type: "singularity",
        character: "X",
        special: true,
        upgrade: {
            name: "Singularity",
            description: "Singularity (special): ???",
            cost: (): Decimal => new Decimal("1e1000"),
        },
    },
] as const satisfies QACellStaticSpawner[];

type QACellType = typeof cellTypes[number]["type"];

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        cellTypes,
        tableCells: () => {
            // Log table of cell types cost
            const tiersToTable: Decimal[] = ([
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                15,
                20,
                25,
                30,
                35,
                40,
                45,
                50,
                60,
                70,
                80,
                90,
                100,
                // 150,
                // 200,
                // 250,
                // 300,
                // 400,
                // 500,
                // 600,
                // 700,
                // 800,
                // 900,
                // 1000,

                // unrealistic
                // 1e4,
                // 1e5,
                // 1e6,
                // 1e9,
                // 1e12,
                // 1e15,
            ] as DecimalSource[]).map(source => new Decimal(source));

            // For each cell type, table the cost of each tier (seperate table for each cell type)
            cellTypes.forEach((cell) => {
                console.table(tiersToTable.map(tier => ({
                    type: cell.type,
                    tier: tier.format(),
                    cost: cell.upgrade.cost(tier).format(),

                    // How much the cost increases from the previous tier (first derivative)
                    "multiplier": cell.upgrade.cost(tier).div(cell.upgrade.cost(tier.sub(1))).format(),

                    // How much the multiplier increases from the previous tier (second derivative)
                    "multiplier ^2": cell.upgrade.cost(tier).div(cell.upgrade.cost(tier.sub(1)))
                        .div(cell.upgrade.cost(tier.sub(1)).div(cell.upgrade.cost(tier.sub(2)))).format(),
                })));
            });
        },
    });
}

export { cellTypes };
export type { QACellStaticSpawner, QACellType };
