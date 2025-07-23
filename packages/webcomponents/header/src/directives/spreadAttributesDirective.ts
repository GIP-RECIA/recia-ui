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

import type { DirectiveResult, ElementPart } from 'lit/directive.js'
import { directive, Directive, PartType } from 'lit/directive.js'

type AttributeMap = Record<string, unknown> | undefined | null
type PreserveFilter = Set<string> | ((name: string) => boolean)

class SpreadAttributesDirective extends Directive {
  render(_attrs: AttributeMap, _preserve?: PreserveFilter): void {}

  update(part: ElementPart, [attrs, preserve]: [AttributeMap, PreserveFilter?]): void {
    if (part.type !== PartType.ELEMENT || !(part.element instanceof HTMLElement))
      return

    const el = part.element

    const shouldPreserve = (name: string): boolean => {
      if (!preserve)
        return false
      return preserve instanceof Set ? preserve.has(name) : preserve(name)
    }

    if (!attrs) {
      Array.from(el.attributes).forEach((attr) => {
        if (!shouldPreserve(attr.name))
          el.removeAttribute(attr.name)
      })
      return
    }

    for (const [name, value] of Object.entries(attrs)) {
      if (value === false || value == null) {
        if (!shouldPreserve(name))
          el.removeAttribute(name)
      }
      else {
        el.setAttribute(
          name,
          typeof value === 'object' ? JSON.stringify(value) : String(value),
        )
      }
    }
  }
}

const spreadAttributes: (
  attrs: AttributeMap,
  preserve?: PreserveFilter
) => DirectiveResult<typeof SpreadAttributesDirective> = directive(SpreadAttributesDirective)

export { spreadAttributes }
