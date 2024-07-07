/**
 * @file Declares the quantum assembler feature (basically reactor grid)
 */
import { Grid, Decimal } from "emath.js";
import type { UpgradeInit } from "emath.js";
import { Expose, Type } from "class-transformer";
// import Game from "../game";

interface QAGridCell {
    tier: Decimal;
}

interface QACellStaticSpawner {
    /** The type of the cell */
    type: string;

    /** The upgrade of the cell */
    upgrade: Readonly<Omit<UpgradeInit, "id">>;

    /** The image of the cell */
    image?: string;
}

/**
 * Represents a cell type in the quantum assembler grid
 */
class QACell {
    /** The type of the cell */
    @Expose()
    public type: string;

    /** The tier of the cell */
    @Type(() => Decimal)
    public tier: Decimal;

    constructor (type: string, tier: Decimal) {
        this.type = type;
        this.tier = tier;
    }
}

// TODO: Add images, costs
const cellTypes = [
    {
        type: "void",
        upgrade: {
            name: "Void",
            description: "Does nothing.",
            cost: (): Decimal => Decimal.dZero,
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

    // special (1 max per grid)
    {
        type: "graviton",
        upgrade: {
            name: "Graviton",
            description: "Graviton: increases the value of all cells by (TODO).",
            cost: (): Decimal => Decimal.dZero,
        },
    },
    {
        type: "higgs boson",
        upgrade: {
            name: "Higgs Boson",
            description: "Higgs Boson: increases the value by ^2 (TODO)",
            cost: (): Decimal => Decimal.dZero,
        },
    },
] as const satisfies QACellStaticSpawner[];

const quantumAssemblerGrid = new Grid<QAGridCell>(5, 5, { tier: Decimal.dZero });
