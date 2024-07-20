/**
 * @file Declares the energy display component
 */
import React from "react";
import { useGameState } from "../gameStateContext";
// import { Button } from "@mui/material";
// import { Decimal } from "emath.js";
// import { energy, instability } from "../game/energy";

const EnergyDisplay: React.FC = () => {
    const gameState = useGameState();
    const { energy, instability } = gameState;

    const energyValue = energy.value;
    const instabilityValue = instability.value;

    const energyGain = energyValue.formatGain(energy.boost.calculate());
    const instabilityGain = instabilityValue.formatGain(instability.boost.calculate());

    return (
        <p>
            {/* Energy: {Decimal.formats.ev(energy.value)} */}
            Energy: {energyValue.format()} {energyGain}
            <br />
            Instability: {instabilityValue.format()} {instabilityGain}
        </p>
    );
}

export default EnergyDisplay;
