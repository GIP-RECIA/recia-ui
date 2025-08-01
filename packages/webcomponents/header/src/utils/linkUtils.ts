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

import type { Link } from '../types/index.ts'
import pathHelper from '../helpers/pathHelper.ts'
import { $settings } from '../stores/index.ts'

function getServiceLink(
  fname: string,
  alternativeMaximizedLink: string | undefined,
  alternativeMaximizedLinkTarget: string | undefined,
): Link {
  const { contextApiUrl, domain } = $settings.get() ?? {}

  return {
    href: alternativeMaximizedLink ?? pathHelper.getUrl(`${contextApiUrl}/p/${fname}`, domain),
    target: alternativeMaximizedLinkTarget ?? '_self',
    rel: alternativeMaximizedLink ? 'noopener noreferrer' : undefined,
  }
}

function getDomainLink(
  path: string,
): string {
  const { domain } = $settings.get() ?? {}

  return pathHelper.getUrl(path, domain)
}

export {
  getDomainLink,
  getServiceLink,
}
