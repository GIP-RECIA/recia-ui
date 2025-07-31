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

import type { HeaderProperties } from './headerTypes.ts'

export interface TemplateApiResponse {
  version: string
  data: Array<TemplateApiData>
  config: Partial<HeaderProperties>
}

interface TemplateApiData {
  identity: {
    Id: string
    name: string
    domains?: Array<string>
    uai?: Array<string>
  }
  images: Array<{
    Id: string
    name: string
    path?: string
    url?: string
    parameters?: Array<{
      propertie: string
      value: string
    }>
  }>
  colors: Array<{
    Id: string
    hexa: string
    rgb: {
      r: number
      g: number
      b: number
    }
  }>
  sponsors: Array<{
    Id: string
    name: string
    url?: string
    logo: {
      path?: string
      url?: string
      parameters?: Array<{
        propertie: string
        value: string
      }>
    }
  }>
}

export interface Template {
  id: string
  name: string
  iconPath: string
  config: Partial<HeaderProperties>
}
