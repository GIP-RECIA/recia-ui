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

import type { TemplateApiResponse } from '../types/TemplateApiResponseType.ts'
import type { Template } from '../types/TemplateType.ts'

export default class TemplateService {
  static async get(
    templateApiUrl: string,
    domain: string,
  ): Promise<Template | undefined> {
    try {
      const options = {
        method: 'GET',
      }

      const response = await fetch(templateApiUrl, options)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const templates: TemplateApiResponse = await response.json()

      if (templates.data) {
        const currenTemplate = templates.data?.find(
          tpl => tpl?.identity?.domains?.includes(domain),
        )
        if (currenTemplate) {
          const name = currenTemplate?.identity?.name
          const logo = currenTemplate?.images?.find(image => image?.Id === 'logo')
          const sponsors = currenTemplate?.sponsors?.filter(sponsor => sponsor?.url && sponsor?.logo?.path)
            .map((sponsor) => {
              return {
                name: sponsor.name,
                url: sponsor.url!,
                logoPath: sponsor.logo.path!,
              }
            })
          if (logo) {
            const template: Template = {
              name,
              logoPath: logo?.path ?? '',
            }
            if (sponsors)
              template.sponsors = sponsors
            return template
          }
          else {
            console.error('Incorrect template datas', logo)
          }
        }
        else {
          console.error(`No template found for ${domain}`, templates.data)
        }
      }
    }
    catch (err) {
      console.error(err, templateApiUrl)
      return undefined
    }
    return undefined
  }
}
