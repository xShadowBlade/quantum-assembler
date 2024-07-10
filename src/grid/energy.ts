/**
 * @file Declares the energy currency
 */
import { Decimal } from "emath.js";
import type { ItemInit } from "emath.js";
import { Game } from "../game";
import { cellTypes } from "./cellTypes";
import type { QACellType } from "./cellTypes";

const energyItems = cellTypes.map((cell): ItemInit => ({
    ...cell.upgrade,
    id: cell.type,
}) as const) as (ItemInit)[] & { id: QACellType }[];

/**
 * The energy currency
 */
const energy = Game.addCurrency("energy", [], energyItems);

// energy.getItem("void");

// debug
if (Game.config.mode === "development") {
    Object.assign(window, { energy });
}

export { energy };
