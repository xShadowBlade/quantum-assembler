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
    mode: "development",
});

if (Game.config.mode === "development") {
    // Load the eMath library for debugging purposes
    void (async (): Promise<void> => {
        const keysToLoad = {
            eMath: await import("emath.js"),
            eMathGame: await import("emath.js/game"),
            eMathPresets: await import("emath.js/presets"),
        };

        Object.assign(window, keysToLoad);
    })();

    // Load the game for debugging purposes
    Object.assign(window, { Game });
}

export { Game };
