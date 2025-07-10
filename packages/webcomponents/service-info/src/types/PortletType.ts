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

export interface Portlet {
  nodeId: string
  title: string
  description: string
  url: string
  iconUrl: string
  faIcon?: string
  fname: string
  target?: string
  widgetURL?: string
  widgetType?: string
  widgetTemplate?: string
  widgetConfig?: string
  staticContent?: string
  pithyStaticContent?: string
  altMaxUrl: boolean
  renderOnWeb: boolean
  parameters: portletParameters
}

export interface portletParameters {
  hideFromDesktop: boolean
  blockImpersonation: boolean
  mobileIconUrl: string
  hasAbout: boolean
  editable: boolean
  alternate: boolean
  disableDynamicTitle: boolean
  hideFromMobile: boolean
  highlight: boolean
  alternativeMaximizedLink?: string
  alternativeMaximizedLinkTarget?: string
  iconUrl: boolean
  chromeStyle: boolean
  configurable: boolean
  disablePortletEvents: boolean
  hasHelp: boolean
}
