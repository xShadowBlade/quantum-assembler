/**
 * @file Declares the energy display component
 */
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Decimal } from "emath.js";
import { energy, instability } from "./grid/energy";

const EnergyDisplay: React.FC = () => {
    return (
        <p>
            {/* Energy: {Decimal.formats.ev(energy.value)} */}
            Energy: {energy.value.format()} {energy.value.formatGain(energy.boost.calculate())}
            <br />
            Instability: {instability.value.format()} {instability.value.formatGain(instability.boost.calculate())}
        </p>
    );
}

export default EnergyDisplay;
