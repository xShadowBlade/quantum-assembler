/**
 * @file Initializes the game and loads the data
 */
import { Game } from "./game";

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
