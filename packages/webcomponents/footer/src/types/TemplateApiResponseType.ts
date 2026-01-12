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

export interface TemplateApiResponse {
  version: string
  data: TemplateApiData[]
}

interface TemplateApiData {
  identity: {
    Id: string
    name: string
    domains?: string[]
    uai?: string[]
  }
  images: {
    Id: string
    name: string
    path?: string
    url?: string
    parameters?: {
      propertie: string
      value: string
    }[]
  }[]
  colors: {
    Id: string
    hexa: string
    rgb: {
      r: number
      g: number
      b: number
    }
  }[]
  sponsors: {
    Id: string
    name: string
    url?: string
    logo: {
      path?: string
      url?: string
      parameters?: {
        propertie: string
        value: string
      }[]
    }
  }[]
}
