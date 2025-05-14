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

/**
 * Bottom sheet
 */

// Bottom sheet info
const bottomSheetInfo = document.querySelector<HTMLElement>('#bottom-sheet-info')

let isBottomSheetInfo = false

function toggleBottomSheetInfo(): void {
  isBottomSheetInfo = !isBottomSheetInfo
  document.documentElement.style.overflowY = isBottomSheetInfo ? 'hidden' : ''
  bottomSheetInfo!.style.display = isBottomSheetInfo ? '' : 'none'
}

bottomSheetInfo?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => toggleBottomSheetInfo())
bottomSheetInfo?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => toggleBottomSheetInfo())

// Bottom sheet service more
const bottomSheetInfoServiceMore = document.querySelector<HTMLElement>('#bottom-sheet-service-more')

let isBottomSheetInfoServiceMore = false

function toggleBottomSheetInfoServiceMoreState(): void {
  if (!bottomSheetInfoServiceMore)
    return
  isBottomSheetInfoServiceMore = !isBottomSheetInfoServiceMore
  document.documentElement.style.overflowY = isBottomSheetInfoServiceMore ? 'hidden' : ''
  bottomSheetInfoServiceMore.style.display = isBottomSheetInfoServiceMore ? '' : 'none'
}

bottomSheetInfoServiceMore?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => toggleBottomSheetInfoServiceMoreState())
bottomSheetInfoServiceMore?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => toggleBottomSheetInfoServiceMoreState())
document.querySelector<HTMLButtonElement>('button.service-more')?.addEventListener('click', (e) => {
  e.preventDefault()
  toggleBottomSheetInfoServiceMoreState()
})

/**
 * Extended Uportal Header
 */

const extendedUportalHeader = document.querySelector<HTMLElement>('.extended-uportal-header')

// Dropdown info
const dropdownInfo = document.querySelector<HTMLElement>('.dropdown-info')
const dropdownInfoButton = dropdownInfo?.querySelector<HTMLButtonElement>('button.dropdown-info-button')

let isDropdownInfoExpended = false

function toggleDropdownInfo(): void {
  if (!dropdownInfo || !dropdownInfoButton)
    return
  isDropdownInfoExpended = !isDropdownInfoExpended
  dropdownInfoButton.ariaExpanded = isDropdownInfoExpended.toString()
  isDropdownInfoExpended ? dropdownInfoButton.classList.add('active') : dropdownInfoButton.classList.remove('active')
  const dropdownInfoMask = dropdownInfo?.querySelector<HTMLElement>('.dropdown-info-mask')
  dropdownInfoMask && (dropdownInfoMask.style.display = isDropdownInfoExpended ? '' : 'none')
  const dropdownInfoMenu = dropdownInfo?.querySelector<HTMLElement>('#dropdown-info-menu')
  dropdownInfoMenu && (dropdownInfoMenu.style.display = isDropdownInfoExpended ? '' : 'none')
}

dropdownInfoButton?.addEventListener('click', () => toggleDropdownInfo())

// Eyebrow
const eyebrow = document.querySelector<HTMLElement>('.eyebrow')
const eyebrowButton = eyebrow?.querySelector<HTMLButtonElement>('button.eyebrow-button')

let isEyebrowExpended = false

function toggleEyebrow(): void {
  if (!eyebrow || !eyebrowButton)
    return
  isEyebrowExpended = !isEyebrowExpended
  eyebrowButton.ariaExpanded = isEyebrowExpended.toString()
  const buttonIcon = eyebrowButton.querySelector<HTMLElement>('svg')
  buttonIcon?.classList.remove('fa-chevron-down', 'fa-chevron-up')
  buttonIcon?.classList.add(isEyebrowExpended ? 'fa-chevron-up' : 'fa-chevron-down')
  const eyebrowMenu = eyebrow.querySelector<HTMLElement>('#eyebrow-menu')
  eyebrowMenu && (eyebrowMenu.style.display = isEyebrowExpended ? '' : 'none')
}

eyebrowButton?.addEventListener('click', () => toggleEyebrow())
eyebrow?.querySelector<HTMLButtonElement>('button#info-etab')?.addEventListener('click', () => {
  toggleEyebrow()
  toggleBottomSheetInfo()
})

// Search
const search = extendedUportalHeader?.querySelector<HTMLElement>('.expended .search')

let isExtendedUportalHeaderExpended = false

function toggleSearch(): void {
  if (!extendedUportalHeader)
    return
  isExtendedUportalHeaderExpended = !isExtendedUportalHeaderExpended
  document.documentElement.style.overflowY = isExtendedUportalHeaderExpended ? 'hidden' : ''
  const extendedUportalHeaderExpended = extendedUportalHeader?.querySelector<HTMLElement>('.expended')
  extendedUportalHeaderExpended && (extendedUportalHeaderExpended.style.display = isExtendedUportalHeaderExpended ? '' : 'none')
}

extendedUportalHeader?.querySelector<HTMLButtonElement>(('.end > button.search-button'))?.addEventListener('click', () => toggleSearch())
search?.querySelector<HTMLButtonElement>('.search-field > .end > button')?.addEventListener('click', () => toggleSearch())
