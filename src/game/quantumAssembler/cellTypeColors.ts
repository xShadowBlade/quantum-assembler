/**
 * @file Declares the cell type colors using material ui
 */
import { Game } from "../game";
import { cellTypes } from "./cellTypes";
import type { QACellType } from "./cellTypes";

import { createTheme, alpha, getContrastRatio } from "@mui/material/styles";
import type { ThemeOptions, Palette } from "@mui/material/styles";

const augmentColor = createTheme().palette.augmentColor;

const createCellTheme = (color: string) => augmentColor({
    color: {
        main: color,
        light: alpha(color, 0.5),
        dark: alpha(color, 0.75),
        contrastText: getContrastRatio(color, "#fff") > 4.5 ? "#fff" : "#111",
    },
});

type ColorShades = "main" | "light" | "dark" | "contrastText";
// type CellColorOverrideKey = `quantumAssembler.${QACellType}.${ColorShades}`;
type CellColorOverrideKey = `quantumAssembler.${QACellType}`;

/**
 * Gets the theme key for a cell type
 * @template S The shade of the color, or false to get the main color
 * @param cellType The cell type
 * @param shade The shade of the color
 * @returns The theme key
 */
// function createCellThemeKey<S extends ColorShades | false = "main"> (cellType: QACellType, shade: S = "main" as S):
//     S extends false ? `quantumAssembler.${QACellType}` : `quantumAssembler.${QACellType}.${S}`
// {
//     // return `quantumAssembler.${cellType}.${shade}`;

//     if (shade === false) {
//         return `quantumAssembler.${cellType}` as ReturnType<typeof createCellThemeKey>;
//     } else {
//         return `quantumAssembler.${cellType}.${shade}` as ReturnType<typeof createCellThemeKey>;
//     }
// }
function createCellThemeKey (cellType: QACellType): CellColorOverrideKey {
    return `quantumAssembler.${cellType}`;
}

const cellThemeOptionsPalette = Object.fromEntries(cellTypes.map((cellType) => {
    return [createCellThemeKey(cellType.type), createCellTheme(cellType.color)] as [CellColorOverrideKey, unknown];
})) as {
    [key in CellColorOverrideKey]: unknown;
};

// const cellThemeOptionsPalette: Record<CellColorOverrideKey, unknown> = (() => {
//     const palette: Record<CellColorOverrideKey, unknown> = {} as Record<CellColorOverrideKey, unknown>;

//     for (const cellType of cellTypes) {
//         palette[createCellThemeKey(cellType.type, false)] = createCellTheme(cellType.color);

//         for (const shade of ["main", "light", "dark"] as const) {
//             palette[createCellThemeKey(cellType.type, shade)] = createCellTheme(cellType.color)[shade];
//         }
//     }

//     return palette;
// })();

const cellTheme = createTheme({
    palette: {
        ...cellThemeOptionsPalette,
    },
} as ThemeOptions);

// Module augmentation for the theme

declare module "@mui/material/styles" {
    interface Theme {
        palette: Palette & {
            [key in CellColorOverrideKey]: Record<ColorShades, string>;
        };
    }
}

type ButtonPropsColorOverridesType = {
    [key in CellColorOverrideKey]: true;
}

// Module augmentation for Button
declare module "@mui/material/Button" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ButtonPropsColorOverrides extends ButtonPropsColorOverridesType {}
}

// debug
if (Game.config.mode === "development") {
    Object.assign(window, {
        cellTheme,
        cellThemeOptionsPalette,
        createCellTheme,
        createCellThemeKey,
    });
}

export { cellTheme, cellThemeOptionsPalette, createCellTheme, createCellThemeKey };
export type { CellColorOverrideKey, ButtonPropsColorOverridesType };
