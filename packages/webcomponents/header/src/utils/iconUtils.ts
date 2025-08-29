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

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { TemplateResult } from 'lit'
import { faPersonDigging } from '@fortawesome/free-solid-svg-icons'
import { html, nothing, svg } from 'lit'
import { getIconWithStyle } from './fontawesomeUtils.ts'
import { getBusteredLink, getDomainLink } from './linkUtils.ts'

function getSvgIcon(
  iconUrl: string | undefined,
  defaultIcon?: IconDefinition,
): TemplateResult | typeof nothing {
  if (!iconUrl) {
    return defaultIcon
      ? getIconWithStyle(defaultIcon, undefined, { icon: true })
      : nothing
  }

  const hasFragment = /\.svg#[\w-]{1,10}$/.test(iconUrl)
  const isPlainSvg = iconUrl.endsWith('.svg')
  iconUrl = getBusteredLink(iconUrl)

  if (isPlainSvg || hasFragment) {
    const href = isPlainSvg ? `${iconUrl}#icone` : iconUrl
    return svg`
        <svg class="icon" aria-hidden="true">
          <use href="${href}"></use>
        </svg>
      `
  }

  return html`<img src="${getDomainLink(iconUrl)}" alt="" class="icon"> `
}

function getSvgIconService(iconUrl: string | undefined): TemplateResult | typeof nothing {
  return getSvgIcon(iconUrl, faPersonDigging)
}

export {
  getSvgIcon,
  getSvgIconService,
}
