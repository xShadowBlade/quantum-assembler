/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // Add for use with material ui
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {},
    },
    plugins: [],
}
