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
import type { ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { svgSpritemap } from 'vite-plugin-svg-spritemap'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    base: mode === 'development' ? undefined : '/commun/new-ui',
    plugins: [
      svgSpritemap({
        pattern: 'src/icons/**/*.svg',
        currentColor: true,
      }),
    ],
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          main: './index.html',
          login: './login.html',
          logged: './logged.html',
          news: './news.html',
          service: './service.html',
        },
        output: {
          assetFileNames: 'assets/[name].[ext]',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
  })
}
