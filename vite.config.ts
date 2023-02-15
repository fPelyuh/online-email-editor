/* eslint-disable no-console */
/// <reference types="vitest" />
import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
// noinspection SpellCheckingInspection
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer';
// @ts-ignore
import { name, version } from './package.json';

// regions параметры
const isOpenBrowserOnLaunch = process.env.SERVER_OPEN === 'true';
const isAnalyzeBundle = process.env.ANALYZE_BUNDLE === 'true';
// endregion

// region plugins
const plugins: PluginOption[] = [
    react({
        jsxRuntime: 'classic'
    }),
    viteTsconfigPaths(),
    // todo TEMPLATE_SETUP точно ли нужна поддержка импортов как в create-react-app?
    svgrPlugin(),
    eslintPlugin()
];

if (isAnalyzeBundle) {
    console.log('rollup-plugin-visualizer enabled!');
    plugins.push(visualizer());
}
// endregion

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    plugins,
    envDir: '.',
    define: {
        RELEASE_NAME_FALLBACK: `"${name}@${version}"`
    },
    server: {
        port: 3000,
        open: isOpenBrowserOnLaunch
    },
    preview: {
        port: 3010
    },
    build: {
        outDir: 'build',
        sourcemap: true
    },
    test: {
        include: ['**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    }
});
