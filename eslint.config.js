import js from "@eslint/js"
import jsdoc from "eslint-plugin-jsdoc"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

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
    tseslint.configs.recommended,
    {
        files: [allJsTsFiles],
        ...jsdoc.configs["flat/recommended"],
        rules: {
            ...jsdoc.configs["flat/recommended"].rules,
            "jsdoc/require-jsdoc": "off",
        },
    },
])
