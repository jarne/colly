import js from "@eslint/js"
import jsdoc from "eslint-plugin-jsdoc"
import globals from "globals"

export default [
    js.configs.recommended,
    jsdoc.configs["flat/recommended"],
    {
        rules: {
            "no-useless-catch": "off",
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
                ...globals.mocha,
            },
        },
    },
]
