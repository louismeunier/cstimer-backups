import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import commonjs from '@rollup/plugin-commonjs';

const IS_PRODUCTION = !process.env.ROLLUP_WATCH;

export default [
    {
        input: "src/sw/index.ts",
        output: {
            file: __dirname + "/public/build/sw.js",
            format: "cjs"
        },
        plugins: [
            commonjs(),
            typescript(),
            IS_PRODUCTION && terser()
        ]
    },
    // {
    //     input: "src/views/main.ts",
    //     output: {
    //         file: "public/views/bundle/bundle.js",
    //         format: "iife",
    //         name: "popup"
    //     },
    //     plugins: [
    //         svelte(),
    //         css({ output: 'bundle.css' }),
    //         resolve({ browser: true }),
    //         IS_PRODUCTION && terser()
    //     ]
    // }
]
