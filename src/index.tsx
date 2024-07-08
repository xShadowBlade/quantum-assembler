/**
 * @file This file is the entry point for your project.
 */

import React from "react";
import { createRoot } from "react-dom/client";

// Load the eMath library for debugging purposes
void (async (): Promise<void> => {
    const keysToLoad = {
        eMath: await import("emath.js"),
        eMathGame: await import("emath.js/game"),
        eMathPresets: await import("emath.js/presets"),
    };

    Object.assign(window, keysToLoad);
})();

const root = createRoot(document.getElementById("root") ?? document.body);
root.render(<div>Hello World!</div>);
