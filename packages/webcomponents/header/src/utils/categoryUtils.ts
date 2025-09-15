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

import { Category } from '../types/index.ts'

const i18nCategories: Record<Category, string> = {
  [Category.administrationSupport]: 'Administration & Support',
  [Category.communicationCollaboration]: 'Communication & Collaboration',
  [Category.documentsRessources]: 'Documents & Ressources numériques',
  [Category.apprentissageSuivi]: 'Apprentissage & Suivi',
  [Category.citoyensTerritoriaux]: 'Services Citoyens & Territoriaux',
  [Category.rhGestion]: 'Services RH & Gestion',
}

function getCategoryTranslation(category: Category): string {
  return i18nCategories[category]
}

export {
  getCategoryTranslation,
}
