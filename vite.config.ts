/**
 * @file Vite configuration file
 */
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
// import swc from "rollup-plugin-swc";
import react from "@vitejs/plugin-react-swc";
import htmlTemplate from "vite-plugin-html-template";

// import typescript from "rollup-plugin-typescript2";

export default defineConfig({
    publicDir: "public",
    root: "src",
    define: {
        MODE: JSON.stringify(process.env.MODE),
    },
    plugins: [
        // swc({
        //     jsc: {
        //         parser: {
        //             syntax: "typescript",
        //             tsx: true, // If you use react
        //             dynamicImport: true,
        //             decorators: true,
        //         },
        //         target: "es2021",
        //         transform: {
        //             decoratorMetadata: true,
        //         },
        //     },
        // }),
        react({
            // Enable decorator
            tsDecorators: true,
        }),
    ],
    // esbuild: false,
});
