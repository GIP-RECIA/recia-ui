/**
 * Copyright (C) 2025 GIP-RECIA, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable node/prefer-global/process */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import { svgSpritemap } from 'vite-plugin-svg-spritemap'
import { components, prefix } from './config'

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const entry = Object.fromEntries(
    components.map(component => [
      `${prefix}${component}`,
      path.resolve(__dirname, `src/components/${component}`),
    ]),
  )

  return defineConfig({
    publicDir: mode === 'development' ? undefined : false,
    plugins: [
      svgSpritemap({
        pattern: 'src/components/wayf/svg/*.svg',
        filename: 'wayf.spritemap.svg',
        currentColor: true,
      }),
      dts({
        tsconfigPath: './tsconfig.json',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'ress/dist/ress.min.css';`,
        },
      },
    },
    build: {
      sourcemap: true,
      lib: {
        entry,
        formats: ['es'],
      },
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[ext]',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
  })
}
