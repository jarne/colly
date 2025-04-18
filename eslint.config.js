import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import globals from "globals"
import jsdoc from "eslint-plugin-jsdoc"

const allJsTsFiles = "**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"

export default defineConfig([
    {
        files: [allJsTsFiles],
        ...js.configs.recommended,
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha,
            },
        },
    },
    {
        files: [allJsTsFiles],
        ...jsdoc.configs["flat/recommended"],
        rules: {
            ...jsdoc.configs["flat/recommended"].rules,
            "jsdoc/require-jsdoc": "off",
        },
    },
])
