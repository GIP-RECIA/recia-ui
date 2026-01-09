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

import type { Category } from '../types/index.ts'
import { $categories } from '../stores/index.ts'

const classCategories: Record<number, string> = {
  60: 'rhGestion',
  61: 'citoyensTerritoriaux',
  62: 'apprentissageSuivi',
  63: 'administrationSupport',
  64: 'communicationCollaboration',
  65: 'documentsRessources',
}

function getCategoryData(category: number | undefined): Partial<Category> & {
  className: string
} | undefined {
  if (!category)
    return

  const categories = $categories.get()

  if (!categories)
    return { className: classCategories[category] }

  return {
    ...categories.find(({ id }) => category === id),
    className: classCategories[category],
  }
}

export {
  getCategoryData,
}
