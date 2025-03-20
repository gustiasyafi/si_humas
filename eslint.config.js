import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
// Import necessary parser for JSX
import babelParser from "@babel/eslint-parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["resources/js/**/*.{js,jsx}"],
        ...react.configs.flat.recommended,
        ...react.configs.flat["jsx-runtime"],
        languageOptions: {
            globals: {
                ...globals.browser,
                route: "true",
            },
            // Explicitly set parser for JSX
            parser: babelParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.flat.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/jsx-no-target-blank": "off",
            "react/no-unescaped-entities": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["resources/js/**/*.{js,jsx}"],
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
    {
        ignores: [
            "vendor/**",
            "node_modules/**",
            "public/**",
            "bootstrap/ssr/**",
            "tailwind.config.js",
        ],
    },
    prettier,
];
