/**
 * @file This file is the entry point for your project.
 */
import "reflect-metadata";
import React from "react";
import { createRoot } from "react-dom/client";

import { Game } from "./game";
import "./grid/energy";
import "./grid/quantumAssembler";

import GridVisuals from "./grid";

// After all data is set, initialize the game
Game.init();

// Load the game data
Game.dataManager.loadData();

// Save on unload
window.addEventListener("beforeunload", () => {
    Game.dataManager.saveData();
});

// Save every 30 seconds
Game.eventManager.setEvent("autosave", "interval", 30 * 1000, () => {
    console.log("Autosaving...");
    Game.dataManager.saveData();
});

const root = createRoot(document.getElementById("root") ?? document.body);

const App: React.FC = () => {
    return (
        <div style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
        }}>
            <h1>Quantum Assembler</h1>
            <GridVisuals />
        </div>
    );
};

root.render(<App />);
