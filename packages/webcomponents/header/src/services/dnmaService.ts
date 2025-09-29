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

export default class DnmaService {
  static init(
    dnmaUrl: string,
    fname: string,
  ): void {
    if (document.querySelector('script#dnma'))
      return

    if (!dnmaUrl.includes('?v='))
      dnmaUrl += `?v=${Math.floor(Date.now() / (24 * 60 * 60 * 1000))}`

    const dnmaScript = document.createElement('script')
    dnmaScript.id = 'dnma'
    dnmaScript.src = dnmaUrl
    dnmaScript.addEventListener('load', () => {
      const dnmaSetupScript = document.createElement('script')
      dnmaSetupScript.id = `${dnmaScript.id}-setup`
      dnmaSetupScript.type = 'text/javascript'
      dnmaSetupScript.text = `
        try {
          if (ENT4DNMA) {
            ENT4DNMA.markPage('${fname}');
            ENT4DNMA.markOnEvent('click-portlet-card');
            ENT4DNMA.markOnEvent('favorite-event');
            ENT4DNMA.markOnEvent('service-event');
            ENT4DNMA.markOnEvent('service-info-event');
            ENT4DNMA.markOnEvent('search-event');
            ENT4DNMA.markOnEvent('open-more');
          }
        } catch (error) {
          console.info('DNMA is not available');
        }
      `
      document.body.appendChild(dnmaSetupScript)
    })
    dnmaScript.addEventListener('error', () => {
      // eslint-disable-next-line no-console
      console.info(`Unable to load DNMA`)
    })
    document.body.appendChild(dnmaScript)
  }
}
