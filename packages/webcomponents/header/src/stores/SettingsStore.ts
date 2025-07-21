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
import { Store } from './Store.ts'

export interface SettingsState {
  portalPath: string
  templateApiUrl?: string
  portletInfoApiUrl?: string
  sessionApiUrl?: string
  userInfoApiUrl?: string
  layoutApiUrl?: string
  orgAttributeName?: string
  userAllOrgsIdAttributeName?: string
  organizationApiUrl?: string
  portletApiUrl?: string
  favoriteApiUrl?: string
  soffit?: Soffit
}

export const settingsStore = new Store<SettingsState>({
  portalPath: import.meta.env.VITE_PORTAL_BASE_URL,
})
