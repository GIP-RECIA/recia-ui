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

import type { TemplateResult } from 'lit'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

export function titledLinkListTemplate(title: string, values: string[] | undefined | null): TemplateResult {
  if (values === undefined || values === null || values.length === 0) {
    return html``
  }
  return html`
    <p>${title}</p>
     <ul>
      ${repeat(values, value => value, value =>
          html`
        <li><a href=${value}>${value}</a></li>
        `)
      }
    </ul>`
}
