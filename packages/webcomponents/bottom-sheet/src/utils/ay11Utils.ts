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

import { tabbable } from 'tabbable'

function getActiveElement(
  container: Document | ShadowRoot = document,
  deep: boolean = true,
): Element | null {
  let active = container.activeElement

  if (!deep)
    return active

  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement
  }

  return active
}

function focusTrap(
  container: Element,
  e: KeyboardEvent,
  deep: boolean = true,
): void {
  if (e.key !== 'Tab')
    return

  const focusables = tabbable(container, {
    getShadowRoot: deep,
  })

  if (focusables.length === 0) {
    e.preventDefault()
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = getActiveElement()

  if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

export {
  focusTrap,
  getActiveElement,
}
