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

export interface OrganizationApiResponse {
  id: string
  name: string
  displayName: string
  description: string
  otherAttributes: Record<
    string,
    Array<string | number | boolean>
  >
}

export type Organization = Omit<OrganizationApiResponse, 'otherAttributes'> & {
  logo?: string
}

export interface FilteredOrganization {
  current: Organization
  other: Array<Organization>
}
