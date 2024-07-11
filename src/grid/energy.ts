/**
 * @file Declares the energy currency
 */
import { Decimal } from "emath.js";
import type { ItemInit } from "emath.js";
import { Game } from "../game";
import { cellTypes } from "./cellTypes";
import type { QACellType } from "./cellTypes";

/**
 * The energy items.
 * For each cell type, there is an item so that the player can buy it for different tiers.
 */
const energyItems = cellTypes.map((cell): ItemInit => ({
    ...cell.upgrade,
    id: cell.type,
}) as const) as (ItemInit)[] & { id: QACellType }[];

/**
 * The energy currency
 */
const energy = Game.addCurrency("energy", [], energyItems);

// debug
if (Game.config.mode === "development") {
    Object.assign(window, { energy });
}

export { energy };
