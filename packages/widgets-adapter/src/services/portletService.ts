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

import type {
  PortletCategory,
  PortletFromRegistry,
  PortletRegistryApiResponse,
  Registry,
} from '../types/registryTypes.ts'
import { uniqBy } from 'lodash-es'

export default class PortletService {
  static async getAll(
    portletApiUrl: string,
  ): Promise<Array<PortletFromRegistry> | undefined> {
    try {
      const response = await fetch(portletApiUrl, {
        method: 'GET',
        credentials: 'same-origin',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: PortletRegistryApiResponse = await response.json()

      if (!data.registry.categories) {
        console.error(`No data for ${portletApiUrl}`)
        return undefined
      }

      return PortletService.portletRegistryToArray(data)
    }
    catch (error) {
      console.error(error, portletApiUrl)
      return undefined
    }
  }

  /**
   * Combines a array of arrays into a single level array
   * @param {Array<PortletFromRegistry>} acc - accululator that combines all the arrays
   * @param {Array<PortletFromRegistry>} arr - new array to add to the accumulator
   * @return {Array<PortletFromRegistry>} merged arrays
   */
  private static flatten(
    acc: Array<PortletFromRegistry>,
    arr: Array<PortletFromRegistry>,
  ): Array<PortletFromRegistry> {
    return acc.concat(arr)
  }

  /**
   * Takes the returned array from treeWalker and removes duplicates
   * based on "fname"
   * @param {object} registryJson Portlet Registry Tree
   * @return {Array<PortletFromRegistry>} list of portlets
   */
  static portletRegistryToArray(
    registryJson: PortletRegistryApiResponse | Registry | PortletCategory,
  ): Array<PortletFromRegistry> {
    return PortletService.customUnique(PortletService.treeWalker(registryJson))
  }

  /**
   * Walks the portlet registry tree
   * @param {object} registryJson Portlet Registry Tree
   * @return {Array<PortletFromRegistry>} list of portlets
   */
  private static treeWalker(
    registryJson: PortletRegistryApiResponse | Registry | PortletCategory,
  ): Array<PortletFromRegistry> {
    const { registry } = registryJson as PortletRegistryApiResponse
    const { categories } = registryJson as Registry
    const { name, portlets, subcategories } = registryJson as PortletCategory

    if (registry)
      return PortletService.treeWalker(registry)

    const portletsList: Array<any> = portlets ?? []

    if (portletsList.length > 0)
      portletsList.forEach(p => (p.categories = [name]))

    if (categories) {
      return portletsList
        .concat(categories.map(PortletService.portletRegistryToArray))
        .reduce(PortletService.flatten, [])
    }
    if (subcategories) {
      return portletsList
        .concat(subcategories.map(PortletService.portletRegistryToArray))
        .reduce(PortletService.flatten, [])
    }

    return portletsList
  }

  /**
   * Custom function to remove duplicates portlet on fname, but with merging categories.
   * @param {Array<PortletFromRegistry>} array - Portlet List with duplicates.
   * @return {Array<PortletFromRegistry>} Portlet List without duplicates.
   */
  private static customUnique(array: Array<PortletFromRegistry>): Array<PortletFromRegistry> {
    const unique = uniqBy(array, 'fname')
    // we construct unique portlets array will all linked categories (reversing category and portlets child)
    return unique.map((elem) => {
      const dupl = array.filter(e => e.fname === elem.fname)
      const allCategories = dupl.flatMap(({ categories }) => categories)

      return { ...elem, categories: [...new Set(allCategories)] }
    })
  }
}
