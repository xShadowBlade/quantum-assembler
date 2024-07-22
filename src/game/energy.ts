/**
 * @file Declares the energy currency
 */
import { Decimal } from "emath.js";
import type { ItemInit } from "emath.js";
import { Game } from "./game";
import { cellTypes } from "./quantumAssembler/cellTypes";
import type { QACellType } from "./quantumAssembler/cellTypes";

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

const instability = Game.addCurrency("instability");

// Set the initial energy boost to 0

energy.boost.setBoost({
    id: "initial",
    value: () => Decimal.dZero,
    order: 0,
});

instability.boost.setBoost({
    id: "initial",
    value: () => Decimal.dZero,
    order: 0,
});

// Gain energy every second
Game.eventManager.setEvent("energyGain", "interval", 0, (dt) => {
    energy.gain(dt);
    instability.gain(dt);
});

// debug
if (Game.config.mode === "development") {
    Object.assign(window, { energy });
}

export { energy, instability };
