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

import { componentName } from '../../../common/config'
import { name } from '../../package.json'
import injectedStyle from '../assets/css/injectedStyle.css?inline'

function calculateScrollbarWidth(): void {
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${window.innerWidth - document.documentElement.clientWidth}px`,
  )
}

function injectStyle(): void {
  const id = componentName(name)
  let style = document.head.querySelector<HTMLStyleElement>(`style#${id}`)
  if (style)
    return

  style = document.createElement('style')
  style.id = id
  style.textContent = injectedStyle
  document.head.appendChild(style)
  window.addEventListener('load', () => {
    document.body.classList.add('transition-active')
  })
}

export {
  calculateScrollbarWidth,
  injectStyle,
}
