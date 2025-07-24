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

export interface LayoutApiResponse {
  user: string
  authenticated: string
  hostname: string
  fragmentAdmin: string
  locale: string
  layout: Layout
}

export interface Layout {
  globals: GlobalsLayout
  regions: RegionLayout[]
  navigation: NavigationLayout
  favorites: FavoriteLayout[]
  favoriteGroups: any[]
}

export interface FavoriteLayout {
  _objectType: string
  ID: string
  deleteAllowed: string
  fragment: string
  precedence: string
  hidden: string
  immutable: string
  locale: Locale
  name: string
  type: string
  unremovable: string
  tabGroup: string
  width: string
  content: FavoriteContent[]
}

export interface FavoriteContent {
  _objectType: ObjectType
  url: string
  iconUrl: string
  ID: string
  chanID: string
  description: string
  fname: string
  locale: Locale
  name: string
  timeout: string
  title: string
  typeID: string
  windowState: WindowState
  portletMode: PortletMode
  portletName: string
  lifecycleState: LifecycleState
  frameworkPortlet?: string
  parameters: FavoriteParameters
  webAppName?: string
}

export enum ObjectType {
  Portlet = 'portlet',
}

export enum LifecycleState {
  Published = 'PUBLISHED',
}

export enum Locale {
  FrFR = 'fr_FR',
}

export interface FavoriteParameters {
  blockImpersonation?: string
  locale?: string
  secure?: string
  hideFromMobile?: string
  iconUrl?: string
  chromeStyle?: ChromeStyle
  disablePortletEvents?: string
  mobileIconUrl?: string
  hasAbout?: string
  editable?: string
  disableDynamicTitle?: string
  alternativeMaximizedLinkTarget?: string
  alternativeMaximizedLink?: string
  configurable?: string
  hasHelp?: string
  hideFromDesktop?: string
  highlight?: string
  showChrome?: string
  alternate?: string
  printable?: string
}

export enum ChromeStyle {
  Default = 'default',
}

export enum PortletMode {
  View = 'view',
}

export enum WindowState {
  Normal = 'normal',
}

export interface GlobalsLayout {
  userLayoutRoot: string
  hasFavorites: string
  activeTabGroup: string
  tabsInTabGroup: string
  userImpersonation: string
}

export interface NavigationLayout {
  allowAddTab: string
  tabGroupsList: NavigationTabGroupsList
  tabs: NavigationTab[]
}

export interface NavigationTabGroupsList {
  activeTabGroup: string
  tabGroups: NavigationTabGroup[]
}

export interface NavigationTabGroup {
  name: string
  firstTabId: string
}

export interface NavigationTab {
  ID: string
  addChildAllowed: string
  deleteAllowed: string
  editAllowed: string
  fragment: string
  moveAllowed: string
  precedence: string
  hidden: string
  immutable: string
  locale: Locale
  name: string
  type: string
  unremovable: string
  externalId: string
  tabGroup: string
  width: string
  content: NavigationTabContent[]
}

export interface NavigationTabContent {
  _objectType: string
  ID: string
  addChildAllowed: string
  deleteAllowed: string
  editAllowed: string
  fragment: string
  moveAllowed: string
  precedence: string
  hidden: string
  immutable: string
  locale: Locale
  name: string
  type: string
  unremovable: string
  tabGroup: string
  width: string
  content: NavigationTabContentContent[]
}

export interface NavigationTabContentContent {
  _objectType: ObjectType
  url: string
  iconUrl: string
  ID: string
  chanID: string
  description: string
  deleteAllowed: string
  fragment: string
  moveAllowed: string
  precedence: string
  fname: string
  locale: Locale
  name: string
  timeout: string
  title: string
  typeID: string
  windowState: WindowState
  portletMode: PortletMode
  portletName: string
  lifecycleState: LifecycleState
  webAppName: string
  parameters: FavoriteParameters
}

export interface RegionLayout {
  name: string
  title: string
  folders: any[]
  content: RegionContent[]
}

export interface RegionContent {
  _objectType: ObjectType
  url: string
  iconUrl: string
  ID: string
  chanID: string
  description: string
  fragment: string
  precedence: string
  fname: string
  locale: Locale
  name: string
  timeout: string
  title: string
  typeID: string
  windowState: WindowState
  portletMode: PortletMode
  portletName: string
  lifecycleState: LifecycleState
  frameworkPortlet?: string
  parameters: FavoriteParameters
  webAppName?: string
}
