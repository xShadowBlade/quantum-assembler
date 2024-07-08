/**
 * @file Declares the game class
 */
import { Game as GameClass } from "emath.js/game";

/**
 * Represents the game
 */
const Game = new GameClass({
    name: {
        id: "quantum-assembler",
        title: "Quantum Assembler",
    },
});

export { Game };
