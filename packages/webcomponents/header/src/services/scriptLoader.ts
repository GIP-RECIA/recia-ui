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

import type { ScriptLoad } from '../types/index.ts'

export default class ScriptLoader {
  private static addedUrls: Set<string> = new Set()

  static load(urls: ScriptLoad[] | undefined): void {
    if (!urls)
      return

    urls.forEach(({ src, cacheBuster }) => {
      const originalSrc = src

      if (
        this.addedUrls.has(originalSrc)
        || document.querySelector(`script[src="${originalSrc}"]`)
      ) {
        return
      }

      if (cacheBuster && !src.includes('?v=')) {
        src += `?v=${Math.floor(Date.now() / (cacheBuster * 1000))}`
      }

      const script = document.createElement('script')
      script.src = src
      script.addEventListener('load', (e) => {
        document.dispatchEvent(new CustomEvent('loadedScript', {
          detail: {
            event: e,
          },
        }))
      })
      script.addEventListener('error', () => {
        console.warn(`Failed to load script: ${originalSrc}`)
      })
      document.body.appendChild(script)
      this.addedUrls.add(originalSrc)
    })
  }
}
