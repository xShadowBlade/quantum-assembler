/**
 * @file Declares the game class
 */
import { Game as GameClass } from "emath.js/game";

/**
 * Represents the game
 */
const Game = new GameClass({
    // mode: ((): "development" | "production" => {
    //     try {
    //         // @ts-expect-error - MODE is replaced by webpack, as type: "development" | "production"
    //         return MODE as "development" | "production";
    //     } catch {
    //         return "development";
    //     }
    // })(),
    mode: "development",
    name: {
        id: "quantum-assembler",
        title: "Quantum Assembler",
    },
    settings: {
        framerate: 1,
    },
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
