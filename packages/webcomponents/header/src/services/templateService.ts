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

import type { Template, TemplateApiResponse } from '../types/index.ts'

export default class TemplateService {
  static async get(
    templateApiUrl: string,
  ): Promise<TemplateApiResponse | undefined> {
    try {
      const response = await fetch(templateApiUrl, {
        method: 'GET',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const templates: TemplateApiResponse = await response.json()
      if (!templates.data)
        return undefined

      return templates
    }
    catch (err) {
      console.error(err, templateApiUrl)
      return undefined
    }
  }

  static getCurrent(
    templates: TemplateApiResponse,
    domain: string,
  ): Template | undefined {
    if (templates.data) {
      const currenTemplate = templates.data?.find(
        tpl => tpl?.identity?.domains?.includes(domain),
      )
      if (currenTemplate) {
        const { identity: { Id, name }, images } = currenTemplate
        const icon = images.find(image => image?.Id === 'icon')

        if (icon) {
          return {
            id: Id,
            name,
            iconPath: icon?.path ?? '',
            config: templates.config,
          }
        }
        else {
          console.error('Incorrect template datas', icon)
        }
      }
      else {
        console.error(`No template found for ${domain}`, templates.data)
      }
    }
    return undefined
  }
}
