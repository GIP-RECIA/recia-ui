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

import type { Portlet } from '../types/PortletType.ts'
import type { Soffit } from '../types/SoffitType.ts'
import { uniqBy } from 'lodash-es'

export default class PortletService {
  static async get(
    portalInfoApiUrl: string,
  ): Promise<Partial<Portlet> | undefined> {
    try {
      const response = await fetch(portalInfoApiUrl, {
        method: 'GET',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: { portlet?: Portlet } = await response.json()

      if (!data.portlet) {
        console.error(`No data for ${portalInfoApiUrl}`)
        return undefined
      }

      const { title } = data.portlet

      return {
        title,
      }
    }
    catch (err) {
      console.error(err, portalInfoApiUrl)
      return undefined
    }
  }

  static async getAll(
    soffit: Soffit,
    portletApiUrl: string,
  ): Promise<Array<any> | undefined> {
    try {
      const { token } = soffit
      const response = await fetch(portletApiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: { registry: { categories: Array<PortletCategory> } } = await response.json()

      if (!data.registry.categories) {
        console.error(`No data for ${portletApiUrl}`)
        return undefined
      }

      return PortletService.portletRegistryToArray(data)
    }
    catch (err) {
      console.error(err, portletApiUrl)
      return undefined
    }
  }

  /**
   * Combines a array of arrays into a single level array
   * @param {Array<Portlet>} acc - accululator that combines all the arrays
   * @param {Array<Portlet>} arr - new array to add to the accumulator
   * @return {Array<Portlet>} merged arrays
   */
  private static flatten(acc: Array<any>, arr: Array<any>): Array<any> {
    return acc.concat(arr)
  }

  /**
   * Takes the returned array from treeWalker and removes duplicates
   * based on "fname"
   * @param {object} registryJson Portlet Registry Tree
   * @return {Array<Portlet>} list of portlets
   */
  static portletRegistryToArray(registryJson: any): Array<any> {
    return PortletService.customUnique(PortletService.treeWalker(registryJson))
  }

  /**
   * Walks the portlet registry tree
   * @param {object} registryJson Portlet Registry Tree
   * @return {Array<Portlet>} list of portlets
   */
  private static treeWalker(registryJson: any): Array<any> {
    if (registryJson.registry)
      return PortletService.treeWalker(registryJson.registry)

    const portlets = registryJson.portlets || []

    if (portlets.length > 0)
      portlets.forEach((p: any) => (p.categories = new Array(registryJson.name)))

    if (registryJson.categories) {
      return portlets
        .concat(registryJson.categories.map(PortletService.portletRegistryToArray))
        .reduce(PortletService.flatten, [])
    }
    if (registryJson.subcategories) {
      return portlets
        .concat(registryJson.subcategories.map(PortletService.portletRegistryToArray))
        .reduce(PortletService.flatten, [])
    }

    return portlets
  }

  /**
   * Custom function to remove duplicates portlet on fname, but with merging categories.
   * @param {Array<Portlet>} array - Portlet List with duplicates.
   * @return {Array<Portlet>} Portlet List without duplicates.
   */
  private static customUnique(array: Array<any>): Array<any> {
    const unique = uniqBy(array, 'fname')
    // we construct unique portlets array will all linked categories (reversing category and portlets child)
    unique.forEach((elem) => {
      const dupl = array.filter(e => e.fname === elem.fname)
      const allCategories = dupl.flatMap(({ categories }) => categories)
      elem.categories = [...new Set(allCategories)]
    })
    return unique
  }
}
