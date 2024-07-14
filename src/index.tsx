/**
 * @file This file is the entry point for your project.
 */
import "reflect-metadata";
import React from "react";
import { createRoot } from "react-dom/client";

import "./game/energy";
import "./game/quantumAssembler/quantumAssembler";

import "./game/data";

import App from "./app";

const root = createRoot(document.getElementById("root") ?? document.body);

root.render(<App />);
