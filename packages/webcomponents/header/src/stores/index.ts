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

import type { FilteredOrganization } from '../types/OrganizationType.ts'
import type { Service } from '../types/ServiceType.ts'
import type { Soffit } from '../types/SoffitType.ts'
import type { UserInfo } from '../types/UserInfoType.ts'
import { atom } from 'nanostores'
import OrganizationService from '../services/organizationService.ts'
import SoffitService from '../services/soffitService.ts'
import TemplateService from '../services/templateService.ts'
import UserInfoService from '../services/userInfoService.ts'
import { onDiff } from '../utils/storeUtils.ts'

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
  serviceInfoApiUrl: string
  servicesInfoApiUrl: string
}

const settings = atom<Partial<Settings>>({
  portalPath: import.meta.env.VITE_PORTAL_BASE_URL,
  domain: window.location.hostname,
})

const soffit = atom<Soffit | undefined>()

const userInfo = atom<UserInfo | undefined>()

const organization = atom<FilteredOrganization | undefined>()

const services = atom<Array<Service> | undefined>()

settings.listen(onDiff((diffs) => {
  if (diffs.has('templateApiUrl'))
    initTemplate()

  if (diffs.has('userInfoApiUrl'))
    updateSoffit()
}))

soffit.listen(onDiff((diffs) => {
  if (
    diffs.has('name')
    || diffs.has('picture')
    || diffs.has('ESCOSIRENCourant')
    || diffs.has('ESCOSIREN')
  ) {
    updateUserInfo()
  }
}))

userInfo.listen(onDiff((diffs) => {
  if (diffs.has('orgIds') || diffs.has('currentOrgId'))
    updateOrganization()
}))

async function initTemplate(): Promise<void> {
  const { templateApiUrl, domain } = settings.get()
  if (!templateApiUrl || !domain)
    return

  const template = await TemplateService.get(templateApiUrl, domain)
  console.info('Template', template)
}

async function updateSoffit(): Promise<void> {
  const { userInfoApiUrl } = settings.get()

  if (!userInfoApiUrl)
    return

  const response = await SoffitService.get(userInfoApiUrl)
  soffit.set(response)
  console.info('Soffit', response)
}

function updateUserInfo(): void {
  const { orgAttributeName, userAllOrgsIdAttributeName } = settings.get()
  const soffitObject = soffit.get()

  if (!soffitObject || !orgAttributeName || !userAllOrgsIdAttributeName)
    return

  const response = UserInfoService.getFromSoffit(soffitObject, orgAttributeName, userAllOrgsIdAttributeName)
  userInfo.set(response)
  console.info('UserInfo', response)
}

async function updateOrganization(): Promise<void> {
  const { organizationApiUrl, userAllOrgsIdAttributeName } = settings.get()
  const soffitObject = soffit.get()
  const { orgIds, currentOrgId } = userInfo.get() ?? {}

  if (!soffitObject || !organizationApiUrl || !userAllOrgsIdAttributeName || !orgIds || !currentOrgId)
    return

  const response = await OrganizationService.get(
    soffitObject,
    organizationApiUrl,
    orgIds,
    currentOrgId,
    'ESCOStructureLogo[0]',
  )
  organization.set(response)
  console.info('Organization', response)
}

export {
  organization,
  services,
  settings,
  soffit,
  userInfo,
}
