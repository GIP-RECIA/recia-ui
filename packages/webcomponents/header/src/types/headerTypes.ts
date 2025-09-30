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

import type { DrawerItem } from './drawerTypes.ts'

export interface HeaderProperties {
  messages: unknown
  domain: string
  defaultOrgLogoUrl: string
  defaultOrgIconUrl: string
  defaultAvatarUrl: string
  contextApiUrl: string
  favoriteApiUrl: string
  layoutApiUrl: string
  portletApiUrl: string
  organizationApiUrl: string
  userInfoApiUrl: string
  sessionApiUrl: string
  templateApiUrl: string
  signOutUrl: string
  signInUrl: string
  casUrl: string
  userInfoPortletUrl: string
  switchOrgApiUrl: string
  switchOrgPortletUrl: string
  orgAttributeName: string
  userAllOrgsIdAttributeName: string
  orgTypeAttributeName: string
  orgLogoUrlAttributeName: string
  orgPostalCodeAttributeName: string
  orgStreetAttributeName: string
  orgCityAttributeName: string
  orgMailAttributeName: string
  orgPhoneAttributeName: string
  orgWebsiteAttributeName: string
  sessionRenewDisable: boolean
  portletInfoApiUrl: string
  serviceInfoApiUrl: string
  servicesInfoApiUrl: string
  dnmaUrl: string
  fname: string
  drawerItems: Array<DrawerItem>
  navigationDrawerVisible: boolean
  homePage: boolean
  starter: boolean
  cacheBusterVersion: string
  debug: boolean
}
