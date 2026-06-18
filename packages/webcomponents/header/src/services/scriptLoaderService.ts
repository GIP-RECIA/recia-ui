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
import { $settings } from '../stores/index.ts'

export default class ScriptLoaderService {
  private static addedUrls: Set<string> = new Set()

  private static isDomainAllowded(path: string): boolean {
    if (!path.startsWith('http'))
      return true

    const { domain } = $settings.get()
    const { hostname } = new URL(path)
    const { hostname: locationHostname } = window.location

    return (
      (domain && hostname === domain)
      || (hostname === locationHostname)
    )
  }

  static load(urls: ScriptLoad[] | undefined): void {
    if (!urls)
      return

    urls.forEach(({ src, cacheBuster }) => {
      const originalSrc = src

      if (!import.meta.env.DEV) {
        const { domain } = $settings.get()
        if (!this.isDomainAllowded(originalSrc)) {
          console.error(`Not allowded script domain: ${originalSrc}`)
          return
        }
        else if (!originalSrc.startsWith('http')) {
          src = `https://${domain}${originalSrc.startsWith('/') ? '' : '/'}${originalSrc}`
        }
      }

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
