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

// Bottom sheet info
const bottomSheetInfo = document.querySelector<HTMLElement>('#bottom-sheet-info')
const bottomSheetInfoDraggable = bottomSheetInfo?.querySelector<HTMLElement>('.dragable')

let isBottomSheetInfo = false

function changeBottomSheetInfoState(show: boolean): void {
  if (!bottomSheetInfo)
    return
  document.documentElement.style.overflowY = show ? 'hidden' : ''
  bottomSheetInfo.style.display = show ? '' : 'none'
}

bottomSheetInfoDraggable?.addEventListener('click', () => {
  isBottomSheetInfo = !isBottomSheetInfo
  changeBottomSheetInfoState(isBottomSheetInfo)
})

// Eyebrow
const eyebrow = document.querySelector<HTMLElement>('.eyebrow')
const eyebrowButton = eyebrow?.querySelector<HTMLButtonElement>('.eyebrow-button')
const eyebrowMenu = eyebrow?.querySelector<HTMLElement>('#eyebrow-menu')

let isEyebrowExpended = false

function changeEyebrowState(isExpended: boolean): void {
  if (!eyebrow || !eyebrowButton || !eyebrowMenu)
    return
  eyebrowButton.ariaExpanded = isExpended.toString()
  const buttonIcon = eyebrowButton.querySelector<HTMLElement>('svg')
  buttonIcon?.classList.remove('fa-chevron-down', 'fa-chevron-up')
  buttonIcon?.classList.add(isExpended ? 'fa-chevron-up' : 'fa-chevron-down')
  eyebrowMenu.style.display = isExpended ? '' : 'none'
}

eyebrowButton?.addEventListener('click', () => {
  isEyebrowExpended = !isEyebrowExpended
  changeEyebrowState(isEyebrowExpended)
})

eyebrow?.querySelector<HTMLButtonElement>('#info-etab')?.addEventListener('click', () => {
  isEyebrowExpended = !isEyebrowExpended
  changeEyebrowState(isEyebrowExpended)
  isBottomSheetInfo = !isBottomSheetInfo
  changeBottomSheetInfoState(isBottomSheetInfo)
})

// Dropdown info
const dropdownInfo = document.querySelector<HTMLElement>('.dropdown-info')
const dropdownInfoButton = dropdownInfo?.querySelector<HTMLButtonElement>('.dropdown-info-button')
const dropdownInfoMask = dropdownInfo?.querySelector<HTMLElement>('.dropdown-info-mask')
const dropdownInfoMenu = dropdownInfo?.querySelector<HTMLElement>('#dropdown-info-menu')

let isDropdownInfoExpended = false

function changeDropdownInfoState(isExpended: boolean): void {
  if (!dropdownInfo || !dropdownInfoButton || !dropdownInfoMask || !dropdownInfoMenu)
    return
  dropdownInfoButton.ariaExpanded = isExpended.toString()
  isExpended ? dropdownInfoButton.classList.add('active') : dropdownInfoButton.classList.remove('active')
  dropdownInfoMask.style.display = isExpended ? '' : 'none'
  dropdownInfoMenu.style.display = isExpended ? '' : 'none'
}
dropdownInfoButton?.addEventListener('click', () => {
  isDropdownInfoExpended = !isDropdownInfoExpended
  changeDropdownInfoState(isDropdownInfoExpended)
})
