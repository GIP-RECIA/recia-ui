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
import { fileName, libName } from '../common/config.ts'
import { name } from './package.json'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const { VITE_BASE_URI, VITE_ALLOWED_HOSTS } = process.env

  return defineConfig({
    base: mode === 'development' ? VITE_BASE_URI : undefined,
    server: {
      allowedHosts: JSON.parse(VITE_ALLOWED_HOSTS ?? ''),
    },
    publicDir: mode === 'development' ? undefined : false,
    build: {
      sourcemap: true,
      lib: {
        entry: './src/index.ts',
        formats: ['iife'],
        name: libName(name),
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          entryFileNames: fileName(name),
        },
      },
    },
  })
}
