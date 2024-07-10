/**
 * @file This file is the entry point for your project.
 */

import React from "react";
import { createRoot } from "react-dom/client";

import "./grid/energy";
import "./grid/quantumAssembler";

import GridVisuals from "./grid";

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
