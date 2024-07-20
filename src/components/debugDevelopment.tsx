/**
 * @file Declares the debug development component.
 */
import React from "react";
import { useGameState } from "../gameStateContext";

/**
 * @returns The debug development component.
 */
const DebugDevelopment: React.FC = () => {
    const gameState = useGameState();

    // Assign the gameState to the window object for debugging
    Object.assign(window, { gameState });

    return (
        <div>
            {/* <h2>Debug Development</h2> */}
            <p>
                Selected: ({gameState.selectedCoords[0]}, {gameState.selectedCoords[1]})
            </p>
        </div>
    );
};

export default DebugDevelopment;
