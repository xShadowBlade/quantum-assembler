/**
 * @file Declares the cell types for the grid.
 */
import { Decimal, roundingBase } from "emath.js";
import type { Grid, ItemInit, DecimalSource } from "emath.js";
import { Game } from "../game";
import type { QACell } from "./qaCell";
import type { QAGridCell } from "./quantumAssembler";

// Color
import * as colors from "@mui/material/colors";


/**
 * The static spawner of a cell in the quantum assembler grid
 */
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
    upgrade: Readonly<Omit<ItemInit, "id" | "effect">>;

    /**
     * The effect of the cell
     * @param tier - The tier of the cell
     * @param cell - The cell
     * @param grid - The grid
     */
    effect?: (tier: Decimal, cell: QACell, grid: Grid<QAGridCell>) => void;

    /**
     * Whether the cell is special (only one can be placed in the grid)
     * @default false
     */
    special?: boolean;

    /**
     * The image of the cell
     */
    image?: string;

    /**
     * The color of the cell
     */
    color?: string;
}

/**
 * The types of cells in the quantum assembler grid
 */
const cellTypes = [
    {
        type: "void",
        character: "V",
        color: colors.blueGrey[100],
        upgrade: {
            name: "Void",
            description: "Does nothing.",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "charm",
        character: "C",
        color: colors.pink[100],
        upgrade: {
            name: "Charm Quark",
            description: "Charm Quark: generates charm.",
            cost: (tier): Decimal => tier.pow(tier.plus(2.5)).round(),
            // cost: (tier): Decimal => Decimal.pow(3, tier.add(tier.div(5).pow(1.3)).pow(1.4)).round(),
            // cost: (tier): Decimal => tier.mul(2).add(Decimal.pow(2, tier)).pow(tier).round(),
        },
        effect (tier, cell): void {
            // TODO: Better formula
            const charmGenerationAmount = tier.pow(tier.div(1.5)).round();

            // debug
            // console.log("charmGenerationAmount", charmGenerationAmount.format());

            cell.generation.boost.setBoost({
                id: `charm-${cell.x}.${cell.y}`,
                value: () => charmGenerationAmount,
                // Order 0 is applied first
                order: 0,
            });

            cell.instability.boost.setBoost({
                id: `charm-${cell.x}.${cell.y}`,
                value: () => charmGenerationAmount.div(2),
                // Order 0 is applied first
                order: 0,
            });
        },
    },
    {
        type: "up",
        character: "U",
        color: colors.purple[100],
        upgrade: {
            name: "Up Quark",
            description: "Up Quark: increases value by (TODO) and instability by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(4).mul(1.25)).add(4).round(),
        },
        effect (tier, cell): void {
            // TODO: Better formula
            const valueMultiplier = tier.pow(tier.div(2)).add(1).round();
            const instabilityMultiplier = tier.pow(tier.div(2.5)).add(1).round();

            // debug
            // console.log("up valueMultiplier", {
            //     valueMultiplier: valueMultiplier.format(),
            //     instabilityMultiplier: instabilityMultiplier.format(),
            // });

            // For each cell that this cell is pointing to, set the boost
            cell.getFacingDirection().forEach((cellToSetBoost) => {
                console.log("cellToSetBoost", cellToSetBoost);

                // Set the value boost
                cellToSetBoost.generation.boost.setBoost({
                    id: `up-${cell.x}.${cell.y}`,
                    value: (input): Decimal => input.mul(valueMultiplier),
                    // Order 3 for multiplier
                    order: 3,
                });

                // Set the instability boost
                cellToSetBoost.instability.boost.setBoost({
                    id: `up-${cell.x}.${cell.y}`,
                    value: (input): Decimal => input.mul(instabilityMultiplier),
                    // Order 3 for multiplier
                    order: 3,
                });
            });
        },
    },
    {
        type: "down",
        character: "D",
        color: colors.orange[100],
        upgrade: {
            name: "Down Quark",
            description: "Down Quark: decreases instability by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(3.5).mul(1.25)).add(4).round(),
        },
        effect (tier, cell): void {
            // TODO: Better formula
            const instabilityDivisor = tier.pow(tier.div(2.5)).add(1).round();

            // For each cell that this cell is pointing to, set the boost
            cell.getFacingDirection().forEach((cellToSetBoost) => {
                // Set the instability boost
                cellToSetBoost.instability.boost.setBoost({
                    id: `down-${cell.x}.${cell.y}`,
                    value: (input): Decimal => input.div(instabilityDivisor),
                    // Order 3 for multiplier
                    order: 3,
                });
            });
        },
    },
    {
        type: "strange",
        character: "S",
        color: colors.green[100],
        upgrade: {
            name: "Strange Quark",
            description: "Strange Quark: ends the assembler. (currently does nothing)",
            cost: (tier): Decimal => tier.pow(tier.plus(3)).add(4).round(),
        },
    },
    {
        type: "top",
        character: "T",
        color: colors.red[100],
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
        color: colors.grey[100],
        special: true,
        upgrade: {
            name: "Graviton",
            description: "Graviton (special): increases the effect of all cells by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(7).mul(2)).add(1e9 - 1).round(),
        },
    },
    {
        type: "higgsBoson",
        character: "H",
        color: colors.indigo[100],
        special: true,
        upgrade: {
            name: "Higgs Boson",
            description: "Higgs Boson (special): increases the value by ^2 (TODO)",
            cost: (tier): Decimal => tier.pow(tier.plus(10).mul(3)).add(1e15 - 1).round(),
        },
    },
    {
        type: "zBoson",
        character: "Z",
        color: colors.teal[100],
        special: true,
        upgrade: {
            name: "Z Boson",
            description: "Z Boson (special): increases the value of all cells by (TODO).",
            cost: (tier): Decimal => tier.pow(tier.plus(15).mul(4)).add(1e30 - 1).round(),
        },
    },
    {
        type: "wBoson",
        character: "W",
        color: colors.blue[100],
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
        color: colors.yellow[100],
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
        color: colors.grey[900],
        special: true,
        upgrade: {
            name: "Singularity",
            description: "Singularity (special): ???",
            cost: (): Decimal => new Decimal("1e1000"),
        },
    },
] as const satisfies QACellStaticSpawner[];

type QACellEntry = typeof cellTypes[number];
type QACellType = typeof cellTypes[number]["type"];

// Debugging
if (Game.config.mode === "development") {
    Object.assign(window, {
        cellTypes,
        tableCells: (startCollapsed = true, exclude: QACellType[] = ["void", "singularity", "gluon"]) => {
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
                // Skip excluded cell types
                if (exclude.includes(cell.type)) {
                    return;
                }

                // How much the cost increases from the previous tier (first derivative)
                const getMultiplier = (tier: Decimal): Decimal => cell.upgrade.cost(tier).div(cell.upgrade.cost(tier.sub(1)));

                // How much the multiplier increases from the previous tier (second derivative)
                const getMultiplier2 = (tier: Decimal): Decimal => getMultiplier(tier).div(getMultiplier(tier.sub(1)));

                // How much the multiplier ^2 increases from the previous tier (third derivative)
                // const getMultiplier3 = (tier: Decimal): Decimal => getMultiplier2(tier).div(getMultiplier2(tier.sub(1)));

                // console.groupCollapsed(cell.type);

                if (startCollapsed) {
                    console.groupCollapsed(cell.type);
                } else {
                    console.group(cell.type);
                }

                const entries = ((): Record<string, Record<string, string>> => {
                    const output: Record<string, Record<string, string>> = {};

                    tiersToTable.forEach(tier => {
                        output[tier.toNumber()] = {
                            cost: cell.upgrade.cost(tier).format(),

                            multiplier: Decimal.formats.formatMult(getMultiplier(tier)),
                            "multiplier ^2": Decimal.formats.formatMult(getMultiplier2(tier)),
                            // "multiplier ^3": getMultiplier3(tier).format(),
                        };
                    });

                    return output;
                })();

                console.table(entries);

                // const entries = tiersToTable.map(tier => ({
                //     tier: tier.format(),
                //     cost: cell.upgrade.cost(tier).format(),

                //     multiplier: Decimal.formats.formatMult(getMultiplier(tier)),
                //     "multiplier ^2": Decimal.formats.formatMult(getMultiplier2(tier)),
                //     // "multiplier ^3": getMultiplier3(tier).format(),
                // }));

                // console.table(entries);

                console.groupEnd();
            });
        },
    });
}

export { cellTypes };
export type { QACellStaticSpawner, QACellType, QACellEntry };
