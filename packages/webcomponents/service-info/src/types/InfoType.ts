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

import type { Category } from './CategoryType.ts'
import type { Link } from './LinkType.ts'

export interface Info {
  description: string
  video_link?: string
  categorie_principale?: Category
  tutorials?: Array<Link>
  resource_link?: string
  populations_cible?: Array<string>
  contextes_cible?: Array<string>
  responsable?: string
}
