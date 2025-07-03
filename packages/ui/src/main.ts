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
import './assets/scss/main.scss'

register()

window.addEventListener('load', () => {
  document.body.classList.add('transition-active')
})

/**
 * Functions
 */

function toggleListener(elementSelector: string, menuSelector: string) {
  document.querySelectorAll<HTMLElement>(elementSelector).forEach((element) => {
    const button = element.querySelector<HTMLButtonElement>('button[aria-controls]')

    let isExpended = false

    function toggle() {
      if (!button)
        return
      isExpended = !isExpended
      button.ariaExpanded = isExpended.toString()
      const indicator = button.querySelector<HTMLElement>('.folded-indicator')
      indicator && (indicator.style.rotate = isExpended ? '180deg' : '')
      const menu = element.querySelector<HTMLElement>(menuSelector)
      menu && (menu.style.display = isExpended ? '' : 'none')
    }

    button?.addEventListener('click', () => toggle())
  })
}

/**
 * Grid breakpoints
 */

const gridBreakpoints: Map<string, number> = new Map([
  ['xs', 0],
  ['sm', 576],
  ['md', 768],
  ['lg', 992],
  ['xl', 1200],
  ['xxl', 1400],
])

let currentBreakpoint = 0

function handleBreakpoints(): void {
  let breakpoint = 0
  for (const [_, value] of gridBreakpoints.entries()) {
    if (window.innerWidth >= value)
      breakpoint = value
  }
  currentBreakpoint = breakpoint
}

handleBreakpoints()

window.addEventListener('resize', () => handleBreakpoints())

/**
 * Bottom sheet
 */

function toggleBottomSheet(element: HTMLElement | null, state: boolean): boolean {
  if (!element)
    return state
  state = !state
  if (state) {
    document.documentElement.style.overflowY = 'hidden'
    element.style.display = ''
  }
  else {
    const container = element.querySelector('.scrollable-container')
    container && (container.scrollTop = 0)
    const sheet = element.querySelector('.sheet')
    sheet && (sheet.classList.toggle('slide-down'))
    setTimeout(() => {
      document.documentElement.style.overflowY = ''
      element.style.display = 'none'
      sheet && (sheet.classList.toggle('slide-down'))
    }, 300)
  }

  return state
}

// Bottom sheet info
const bottomSheetInfo = document.querySelector<HTMLElement>('#bottom-sheet-info')
let isBottomSheetInfo = false

bottomSheetInfo?.querySelectorAll<HTMLElement>('.close, .dragable').forEach((el) => {
  el.addEventListener('click', () => {
    isBottomSheetInfo = toggleBottomSheet(bottomSheetInfo, isBottomSheetInfo)
  })
})

// Bottom sheet service more
const bottomSheetInfoServiceMore = document.querySelector<HTMLElement>('#bottom-sheet-service-more')
let isBottomSheetInfoServiceMore = false

document?.querySelectorAll<HTMLElement>('.service > button.more').forEach((el) => {
  el.addEventListener('click', () => {
    isBottomSheetInfoServiceMore = toggleBottomSheet(bottomSheetInfoServiceMore, isBottomSheetInfoServiceMore)
  })
})
bottomSheetInfoServiceMore?.querySelectorAll<HTMLElement>('.close, .dragable').forEach((el) => {
  el.addEventListener('click', () => {
    isBottomSheetInfoServiceMore = toggleBottomSheet(bottomSheetInfoServiceMore, isBottomSheetInfoServiceMore)
  })
})

// Bottom sheet favorites
const bottomSheetFavorites = document.querySelector<HTMLElement>('#bottom-sheet-favorites')
let isBottomSheetFavorites = false

bottomSheetFavorites?.querySelectorAll<HTMLElement>('.close, .dragable').forEach((el) => {
  el.addEventListener('click', () => {
    isBottomSheetFavorites = toggleBottomSheet(bottomSheetFavorites, isBottomSheetFavorites)
  })
})

// Bottom sheet news
const bottomSheetNews = document.querySelector<HTMLElement>('#bottom-sheet-news')
let isBottomSheetNews = false

bottomSheetNews?.querySelectorAll<HTMLElement>('.close, .dragable').forEach((el) => {
  el.addEventListener('click', () => {
    isBottomSheetNews = toggleBottomSheet(bottomSheetNews, isBottomSheetNews)
  })
})

/**
 * Header
 */

const extendedUportalHeader = document.querySelector<HTMLElement>('.header')

// Dropdown info
const dropdownInfo = document.querySelector<HTMLElement>('.dropdown-info')
const dropdownInfoButton = dropdownInfo?.querySelector<HTMLButtonElement>('button')

let isDropdownInfoExpended = false

function toggleDropdownInfo(): void {
  if (!dropdownInfo || !dropdownInfoButton)
    return
  isDropdownInfoExpended = !isDropdownInfoExpended
  dropdownInfoButton.ariaExpanded = isDropdownInfoExpended.toString()
  dropdownInfoButton.classList.toggle('active')
  const dropdownInfoMask = dropdownInfo?.querySelector<HTMLElement>('.mask')
  dropdownInfoMask && (dropdownInfoMask.style.display = isDropdownInfoExpended ? '' : 'none')
  const dropdownInfoMenu = dropdownInfo?.querySelector<HTMLElement>('#dropdown-info-menu')
  dropdownInfoMenu && (dropdownInfoMenu.style.display = isDropdownInfoExpended ? '' : 'none')
}

dropdownInfoButton?.addEventListener('click', () => toggleDropdownInfo())

// Eyebrow
const eyebrow = document.querySelector<HTMLElement>('.user-menu')
const eyebrowButton = eyebrow?.querySelector<HTMLButtonElement>('button')

let isEyebrowExpended = false

function toggleEyebrow(): void {
  if (!eyebrow || !eyebrowButton)
    return
  isEyebrowExpended = !isEyebrowExpended
  eyebrowButton.ariaExpanded = isEyebrowExpended.toString()
  const buttonIcon = eyebrowButton.querySelector<HTMLElement>('svg')
  buttonIcon && (buttonIcon.style.rotate = isEyebrowExpended ? '180deg' : '')
  const eyebrowMenu = eyebrow.querySelector<HTMLElement>('ul')
  eyebrowMenu && (eyebrowMenu.style.display = isEyebrowExpended ? '' : 'none')
}

eyebrowButton?.addEventListener('click', () => toggleEyebrow())
eyebrow?.querySelector<HTMLButtonElement>('button#info-etab')?.addEventListener('click', () => {
  toggleEyebrow()
  isBottomSheetInfo = toggleBottomSheet(bottomSheetInfo, isBottomSheetInfo)
})

/**
 * Navigation drawer
 */

const drawer = extendedUportalHeader?.querySelector<HTMLElement>('.navigation-drawer')

let isDrawerExpended = false

function toggleDrawer() {
  if (!drawer)
    return
  isDrawerExpended = !isDrawerExpended
  drawer.classList.toggle('expended')
}

function closeDrawer() {
  isDrawerExpended = true
  toggleDrawer()
}

extendedUportalHeader?.querySelector<HTMLButtonElement>('button.drawer-toggle')?.addEventListener('click', () => toggleDrawer())

// Dropdown favorite
const favorite = drawer?.querySelector<HTMLElement>('.dropdown-favorites')
const favoriteButton = favorite?.querySelector<HTMLButtonElement>('button')

let isDropdownFavorite = false

function toggleFavorites() {
  if (currentBreakpoint < gridBreakpoints.get('md')!) {
    closeDrawer()
    isBottomSheetFavorites = toggleBottomSheet(bottomSheetFavorites, isBottomSheetFavorites)
  }
  else {
    isDropdownFavorite = !isDropdownFavorite
    favoriteButton?.classList.toggle('active')
    const menu = drawer?.querySelector<HTMLElement>('.dropdown-favorites > div')
    menu && (menu.style.display = isDropdownFavorite ? '' : 'none')
  }
}

favoriteButton?.addEventListener('click', () => {
  isDrawerExpended === true && toggleDrawer()
  toggleFavorites()
})

document.querySelectorAll<HTMLElement>('.favorite-layout').forEach((layout) => {
  const actions = layout.querySelectorAll<HTMLElement>('.actions')
  const button = layout.querySelector<HTMLElement>('button')
  button?.addEventListener('click', () => {
    actions.forEach((action) => {
      action.classList.toggle('disabled')
    })
  })
})

// Dropdown services
const servicesButton = drawer?.querySelector<HTMLButtonElement>('.dropdown-services button')

let isDropdownServices = false

function toggleServices() {
  isDropdownServices = !isDropdownServices
  document.documentElement.style.overflowY = isDropdownServices ? 'hidden' : ''
  isDropdownServices ? servicesButton?.classList.add('active') : servicesButton?.classList.remove('active')
  const menu = extendedUportalHeader?.querySelector<HTMLElement>('#services-layout')
  menu && (menu.style.display = isDropdownServices ? '' : 'none')
}

servicesButton?.addEventListener('click', () => {
  isDrawerExpended === true && toggleDrawer()
  toggleServices()
})

/**
 * Search
 */

const searchButtons = extendedUportalHeader?.querySelectorAll<HTMLButtonElement>('button[aria-label="Rechercher dans l\'ENT"]')
const searchLayout = extendedUportalHeader?.querySelector<HTMLElement>('.topbar > .principal-container > .middle')
const searchMask = extendedUportalHeader?.querySelector<HTMLElement>('.mask')
const searchLayout2 = searchLayout?.querySelector('.search')
const searchInput = searchLayout2?.querySelector<HTMLInputElement>('input')
const searchResults = searchLayout2?.querySelector<HTMLElement>('.search-results')
const searchClear = searchLayout2?.querySelector<HTMLButtonElement>('button')

let isExtendedUportalHeaderExpended = false

function toggleSearch(): void {
  if (!extendedUportalHeader)
    return
  isExtendedUportalHeaderExpended = !isExtendedUportalHeaderExpended
  // const extendedUportalHeaderExpended = extendedUportalHeader?.querySelector<HTMLElement>('.search-container')
  // extendedUportalHeaderExpended && (extendedUportalHeaderExpended.style.display = isExtendedUportalHeaderExpended ? '' : 'none')
  searchLayout && (searchLayout.classList.toggle('visible'))
  searchButtons && searchButtons[0] && (searchButtons[0].style.display = isExtendedUportalHeaderExpended ? 'none' : '')
  if (!isExtendedUportalHeaderExpended) {
    searchInput!.value = ''
    toggleResults(false)
    toggleClear(false)
  }
}

function toggleResults(val: boolean): void {
  searchLayout2?.classList.toggle('searching', val)
  searchMask!.style.display = val ? '' : 'none'
  searchResults!.style.display = val ? '' : 'none'
  document.documentElement.style.overflowY = val ? 'hidden' : ''
}

function toggleClear(val: boolean): void {
  searchClear!.style.display = val ? '' : 'none'
}

searchButtons?.forEach((button) => {
  button.addEventListener('click', () => toggleSearch())
})

searchInput?.addEventListener('input', (e) => {
  const inputValue = (e.target as HTMLInputElement).value
  toggleResults(inputValue.length >= 3)
  toggleClear(inputValue.length > 0)
})

searchClear?.addEventListener('click', () => {
  if (!isExtendedUportalHeaderExpended)
    isExtendedUportalHeaderExpended = true
  toggleSearch()
})

searchLayout?.addEventListener('click', (e) => {
  if (!e.composedPath().includes(searchLayout2 as EventTarget)) {
    if (isExtendedUportalHeaderExpended)
      toggleSearch()
  }
})

/**
 * Notifications drawer
 */

const notificationButton = extendedUportalHeader?.querySelector<HTMLButtonElement>('.notification > button[aria-controls]')
const notificationDrawer = document.querySelector<HTMLElement>('#notification-drawer')

let isNotificationDrawer = false

function toggleNotifications() {
  isNotificationDrawer = !isNotificationDrawer
  notificationButton!.ariaExpanded = isNotificationDrawer.toString()
  notificationDrawer?.classList.toggle('expended')
}

eyebrow?.querySelector<HTMLButtonElement>('#notification')?.addEventListener('click', () => {
  toggleEyebrow()
  toggleNotifications()
})
notificationDrawer?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => toggleNotifications())
notificationButton?.addEventListener('click', () => toggleNotifications())

/**
 * Widgets
 */

toggleListener('.widget-layout > ul > li', '.menu')

const widgetSection = document.querySelector<HTMLElement>('section.widget-layout')
widgetSection?.querySelector<HTMLButtonElement>('button')?.addEventListener('click', () => {
  widgetSection.querySelectorAll('.actions').forEach((action) => {
    action.classList.toggle('disabled')
  })
})

/**
 * Filters
 */

toggleListener('.filters', '.menu')

/**
 * Services
 */

// Favorite
document.querySelectorAll<HTMLButtonElement>('.service > .favorite > button').forEach((button) => {
  button?.addEventListener('click', () => {
    const svg = button.firstElementChild as HTMLElement
    button.setAttribute('aria-label', button.getAttribute('aria-label') === 'Ajouter aux favoris' ? 'Retirer des favoris' : 'Ajouter aux favoris')
    svg.setAttribute('data-prefix', svg.getAttribute('data-prefix') === 'fas' ? 'far' : 'fas')
    svg.classList.toggle('marked')
  })
})

document.querySelectorAll<HTMLButtonElement>('button.tag').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('active')
  })
})

/**
 * Alert
 */

let isAlert = true
const lsAlert = localStorage.getItem('alert')
if (lsAlert !== null)
  isAlert = JSON.parse(lsAlert).isAlert

const alert = document.querySelector<HTMLElement>('.alert')
alert?.querySelector<HTMLButtonElement>('button.close')?.addEventListener('click', () => toggleAlert())
toggleAlert(false)

function toggleAlert(save: boolean = true): void {
  if (save) {
    isAlert = !isAlert
    localStorage.setItem('alert', JSON.stringify({ isAlert }))
  }
  alert && (alert.style.display = isAlert ? '' : 'none')
}

/**
 * News
 */

document.querySelector<HTMLButtonElement>('.news-layout > div > ul > li > button')?.addEventListener('click', () => {
  isBottomSheetNews = toggleBottomSheet(bottomSheetNews, isBottomSheetNews)
})

/**
 * iframe
 */

const params = new URLSearchParams(window.location.search)
const iframe = document.querySelector<HTMLIFrameElement>('iframe')
iframe && (iframe!.src = params.get('service') || '#')
iframe?.addEventListener('load', () => {
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document
  if (!iframeDoc)
    return
  const style = document.createElement('style')
  style.textContent = `
    extended-uportal-header,
    extended-uportal-footer {
      display: none;
    }
  `
  iframeDoc.head.prepend(style)
})

/**
 * Dev tools
 */

const body = document.querySelector('body')
const devContainer = document.createElement('div')
devContainer.style = `
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 0 16px 16px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  z-index: 9999;
`

let isDevTools = false

const devToolsButton = document.createElement('button')
devToolsButton.textContent = 'DT'
devToolsButton.style = `
  background-color: var(--recia-primary, bisque);
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  color: white;
  height: 24px;
  width: 24px;
`
devToolsButton.addEventListener('click', () => toggleDevTools())

const devItems = document.createElement('div')
devItems.style = `
  display: none;
  flex-direction: column;
  gap: 16px;
`

const buttonStyle = `
  padding: 16px;
  background-color: var(--recia-primary, bisque);
  border-radius: 50px;
  font-weight: bold;
  color: white;
`

const themes = ['lycee', 'agri', '18', '28', '36', '37', '41', '45']
let currentTheme = 0
const lsTheme = localStorage.getItem('theme')
if (lsTheme !== null)
  currentTheme = JSON.parse(lsTheme).currentTheme
body?.classList.add(`dom-${themes[currentTheme]}`)

const themeButton = document.createElement('button')
themeButton.textContent = themes[currentTheme]
themeButton.style = buttonStyle
themeButton.addEventListener('click', () => switchTheme())

let isWayf = true

const wayfButton = document.createElement('button')
wayfButton.textContent = `WAYF : ${isWayf}`
wayfButton.style = buttonStyle
wayfButton.addEventListener('click', () => toggleWayf())

const alertButton = document.createElement('button')
alertButton.textContent = `Alert : ${isAlert}`
alertButton.style = buttonStyle
alertButton.addEventListener('click', () => {
  toggleAlert()
  alertButton.textContent = `Alert : ${isAlert}`
})

const dupNews = document.createElement('button')
dupNews.textContent = 'Actualités x2'
dupNews.style = buttonStyle
dupNews.addEventListener('click', () => duplicate('.news-layout > div > ul'))

const dupSuggest = document.createElement('button')
dupSuggest.textContent = 'Suggestions x2'
dupSuggest.style = buttonStyle
dupSuggest.addEventListener('click', () => duplicate('.suggestions-layout > ul'))

devContainer.appendChild(devItems)
devContainer.appendChild(devToolsButton)
devItems.appendChild(themeButton)
devItems.appendChild(wayfButton)
devItems.appendChild(alertButton)
devItems.appendChild(dupNews)
devItems.appendChild(dupSuggest)
body?.appendChild(devContainer)

function toggleDevTools(): void {
  isDevTools = !isDevTools
  devItems.style.display = isDevTools ? 'flex' : 'none'
}

function switchTheme(): void {
  let oldTheme, newTheme
  if (currentTheme + 1 < themes.length) {
    oldTheme = themes[currentTheme]
    currentTheme++
    newTheme = themes[currentTheme]
  }
  else {
    oldTheme = themes[currentTheme]
    currentTheme = 0
    newTheme = themes[currentTheme]
  }
  localStorage.setItem('theme', JSON.stringify({ currentTheme }))
  body?.classList.replace(`dom-${oldTheme}`, `dom-${newTheme}`)
  themeButton.textContent = newTheme
}

function toggleWayf(): void {
  isWayf = !isWayf
  const wayf = document.querySelector<HTMLElement>('.wayf-layout')
  const notLogged = document.querySelector<HTMLElement>('.header > .topbar > .not-logged')
  const grow = notLogged?.querySelector<HTMLElement>('.grow-1')
  const link = notLogged?.querySelector<HTMLElement>('a')
  wayf && (wayf.style.display = isWayf ? '' : 'none')
  grow && (grow.style.display = !isWayf ? '' : 'none')
  link && (link.style.display = !isWayf ? '' : 'none')
  wayfButton.textContent = `WAYF : ${isWayf}`
}

function duplicate(selector: string): void {
  const items = document.querySelector<HTMLUListElement>(selector)
  if (items?.children) {
    const children = Array.from(items.children)
    for (const child of children) {
      const newChild = child.cloneNode(true)
      items.appendChild(newChild)
    }
  }
}
