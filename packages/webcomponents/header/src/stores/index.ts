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

import type { Soffit } from '../types/SoffitType.ts'
import type { User } from '../types/UserType.ts'
import { atom } from 'nanostores'
import SoffitService from '../services/soffitService.ts'
import TemplateService from '../services/templateService.ts'
import { difference } from '../utils/objectUtils.ts'
import UserService from '../services/userService.ts'
import OrganizationService from '../services/organizationService.ts'
import { FilteredOrganization } from '../types/OrganizationType.ts'
import { Service } from '../types/ServiceType.ts'

interface Settings {
  domain: string
  portalPath: string
  templateApiUrl: string
  portletInfoApiUrl: string
  sessionApiUrl: string
  userInfoApiUrl: string
  layoutApiUrl: string
  orgAttributeName: string
  userAllOrgsIdAttributeName: string
  organizationApiUrl: string
  portletApiUrl: string
  favoriteApiUrl: string
  serviceInfoApiUrl: string,
  servicesInfoApiUrl: string,
}

const settingsStore = atom<Partial<Settings>>({
  portalPath: import.meta.env.VITE_PORTAL_BASE_URL,
  domain: window.location.hostname,
})

const soffitStore = atom<Soffit | undefined>()

const userStore = atom<User | undefined>()

const organizationStore = atom<FilteredOrganization | undefined>()

const servicesStore = atom<Array<Service> | undefined>()

settingsStore.listen((newValue, oldValue): void => {
  const diffs = difference(newValue, oldValue)
  if (diffs.size === 0)
    return

  if (diffs.has('templateApiUrl'))
    initTemplate()

  if (diffs.has('userInfoApiUrl'))
    updateSoffit()
})

soffitStore.listen((newValue, oldValue): void => {
  const diffs = difference(newValue, oldValue)
  if (diffs.size === 0)
    return

  if (
    diffs.has('name')
    || diffs.has('picture')
    || diffs.has('ESCOSIRENCourant')
    || diffs.has('ESCOSIREN')
  ) {
    updateUserInfo()
  }
})

userStore.listen((newValue, oldValue): void => {
  const diffs = difference(newValue, oldValue)
  if (diffs.size === 0)
    return

  if (diffs.has('orgIds') || diffs.has('currentOrgId'))
    updateOrganization()
})

async function initTemplate(): Promise<void> {
  const { templateApiUrl, domain } = settingsStore.get()
  if (!templateApiUrl || !domain)
    return

  const template = await TemplateService.get(templateApiUrl, domain)
  console.info('Template', template)
}

async function updateSoffit(): Promise<void> {
  const { userInfoApiUrl } = settingsStore.get()

  if (!userInfoApiUrl)
    return

  const soffit = await SoffitService.get(userInfoApiUrl)
  soffitStore.set(soffit)
  console.info('Soffit', soffit)
}

function updateUserInfo(): void {
  const { orgAttributeName, userAllOrgsIdAttributeName } = settingsStore.get()
  const soffit = soffitStore.get()

  if (!soffit || !orgAttributeName || !userAllOrgsIdAttributeName)
    return

  const userInfo = UserService.getFromSoffit(soffit, orgAttributeName, userAllOrgsIdAttributeName)
  userStore.set(userInfo)
  console.info('UserInfo', userInfo)
}

async function updateOrganization(): Promise<void>  {
const { organizationApiUrl, userAllOrgsIdAttributeName } = settingsStore.get()
  const soffit = soffitStore.get()
  const { orgIds, currentOrgId } = userStore.get() ?? {}

  if (!soffit || !organizationApiUrl || !userAllOrgsIdAttributeName || !orgIds || !currentOrgId)
    return

  const organization = await OrganizationService.get(
    soffit,
    organizationApiUrl,
    orgIds,
    currentOrgId,
    'ESCOStructureLogo[0]',
  )
  organizationStore.set(organization)
  console.info('Organization', organization)
}

export {
  settingsStore,
  soffitStore,
  userStore,
  organizationStore,
  servicesStore
}
