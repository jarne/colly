import js from "@eslint/js"
import reactRecommended from "eslint-plugin-react/configs/recommended.js"
import jsdoc from "eslint-plugin-jsdoc"
import globals from "globals"

export default [
    js.configs.recommended,
    reactRecommended,
    jsdoc.configs["flat/recommended"],
    {
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "jsdoc/require-jsdoc": "off",
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
        },
    },
]
