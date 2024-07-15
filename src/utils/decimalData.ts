/**
 * @file Declares the DecimalData interface and decimalDataToDecimal function
 */
import { Decimal } from "emath.js";

/**
 * Represents the data of a Decimal
 */
interface DecimalData {
    sign: number;
    mag: number;
    layer: number;
}

/**
 * Converts a DecimalData to a Decimal
 * @param data The DecimalData to convert
 * @returns The Decimal
 */
function decimalDataToDecimal (data: Decimal | DecimalData): Decimal {
    return Decimal.fromComponents(data.sign, data.layer, data.mag);
}

/**
 * Converts a Decimal to DecimalData
 * @param decimal The Decimal to convert
 * @returns The DecimalData
 */
function decimalToDecimalData (decimal: Decimal | DecimalData): DecimalData {
    return {
        sign: decimal.sign,
        mag: decimal.mag,
        layer: decimal.layer,
    };
}

export { decimalDataToDecimal, decimalToDecimalData };
export type { DecimalData };
