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

import type { LitElement } from 'lit'
import type { ReciaHeader } from '../index.ts'

export type HeaderProperties = Omit<
  ReciaHeader,
  | keyof LitElement
  | keyof HTMLElement
  | 'render'
  | 'update'
  | 'requestUpdate'
  | 'connectedCallback'
  | 'disconnectedCallback'
  | 'isNavigationDrawerExpanded'
  | 'isServicesLayout'
  | 'isFavoriteDropdown'
  | 'isSearchOpen'
  | 'isSearching'
  | 'serviceInfoRef'
  | 'changeEtabRef'
  | 'infoEtabRef'
>

export type SettingsHeaderProperties = Exclude<
  keyof HeaderProperties,
  | 'templateApiPath'
  | 'sessionRenewDisable'
  | 'marginTop'
  | 'debug'
>
