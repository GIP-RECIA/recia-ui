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

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { TemplateResult } from 'lit'
import type { ClassInfo } from 'lit/directives/class-map.js'
import type { StyleInfo } from 'lit/directives/style-map.js'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { svg } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

function getIcon(svgDefinition: IconDefinition): TemplateResult {
  return svg`${icon(svgDefinition).node[0]}`
}

function getPath(data: string): TemplateResult {
  return svg`<path fill="currentColor" d="${data}"></path>`
}

function getIconWithStyle(svgDefinition: IconDefinition, styles: Readonly<StyleInfo> = {}, classes: Readonly<ClassInfo> = {}): TemplateResult {
  const { prefix, iconName, icon: [width, height, , , pathData] } = svgDefinition

  return svg`
      <svg
        style="${styleMap(styles)}"
        aria-hidden="true"
        focusable="false"
        data-prefix="${prefix}"
        data-icon="${iconName}"
        class="${classMap({
          ...classes,
          'svg-inline--fa': true,
          [`fa-${iconName}`]: true,
        })}"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${width} ${height}"
      >
        ${
          typeof pathData !== 'string'
            ? pathData.map(data => getPath(data))
            : getPath(pathData)
        }
      </svg>
    `
}

export {
  getIcon,
  getIconWithStyle,
}
