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

import { register } from './plugings/fontawesome'
import 'ress/dist/ress.min.css'
import './assets/scss/main.scss'

register()

// Eyebrow
const eyebrow = document.querySelector<HTMLElement>('.eyebrow')
const eyebrowButton = eyebrow?.querySelector<HTMLButtonElement>('.eyebrow-button')
const eyebrowMenu = eyebrow?.querySelector<HTMLElement>('#eyebrow-menu')
if (eyebrow && eyebrowButton && eyebrowMenu) {
  let isEyebrowExpended = false
  eyebrowButton.addEventListener('click', () => {
    isEyebrowExpended = !isEyebrowExpended
    eyebrowButton.ariaExpanded = isEyebrowExpended.toString()
    const buttonIcon = eyebrowButton.querySelector<HTMLElement>('svg')
    buttonIcon?.classList.remove('fa-chevron-down', 'fa-chevron-up')
    buttonIcon?.classList.add(isEyebrowExpended ? 'fa-chevron-up' : 'fa-chevron-down')
    eyebrowMenu.style.display = isEyebrowExpended ? '' : 'none'
  })
}
