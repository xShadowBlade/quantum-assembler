/**
 * @file Declares the energy display component
 */
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Decimal } from "emath.js";
import { energy, instability } from "../game/energy";

const EnergyDisplay: React.FC = () => {
    const energyValue = energy.value;
    const instabilityValue = instability.value;

    // TODO: Fix attribute not resetting

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
