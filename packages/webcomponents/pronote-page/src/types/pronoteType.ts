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

export interface ResponseDto {
  profil: 'Eleve' | 'Parent'
}

export type ResponseEleveDto = ResponseDto & {

  resumeDeCoursDtoList: ResumeDeCoursDto[] | null | undefined
  travailAFaireDtoList: TravailAfaireDto[] | null | undefined
  vieScolaireDto: VieScolaireDto | null | undefined
  devoirDtoList: DevoirDto[] | null | undefined

}

export interface ResumeDeCoursDto {
  id: string
  matiere: string
  date: string
  contenuDeCoursList: ContenuDeCoursDto[] | null | undefined
}

export interface ContenuDeCoursDto {
  titre: string | null | undefined
  categorie: string | null | undefined
  descriptif: string | null | undefined
  pieceJointeList: string[] | null | undefined
  siteInternetList: string[] | null | undefined
}

export interface TravailAfaireDto {
  coursId: string | null | undefined
  matiere: string | null | undefined
  descriptif: string | null | undefined
  pourLe: string
  pieceJointeList: string[] | null | undefined
  siteInternetList: string[] | null | undefined
}

export interface VieScolaireDto {
  absenceList: AbsenceDto[] | null | undefined
  retardList: RetardDto[] | null | undefined
  passageInfirmerieList: PassageInfirmerieDto[] | null | undefined
  punitionList: PunitionDto[] | null | undefined
  sanctionList: SanctionDto[] | null | undefined
  observationList: ObservationDto[] | null | undefined
}

export interface AbsenceDto {
  dateDebut: string // dateTime
  dateFin: string // dateTime
  estOuverte: boolean
  justifie: boolean
  motif: string | undefined | null
}

export interface RetardDto {
  date: string // dateTime
  justifie: boolean
  motif: string | undefined | null
}

export interface PassageInfirmerieDto {
  date: string // dateTime
}

export interface PunitionDto {
  date: string
  nature: string
  matiere: string | undefined | null
  motif: string
  circonstances: string | undefined | null
}

export interface SanctionDto {
  date: string
  nature: string
  motif: string
  circonstances: string | undefined | null
  duree: number | undefined | null
}

export interface ObservationDto {
  date: string
  demandeur: string
  matiere: string
  observation: string
}

export interface DevoirDto {
  note: string
  bareme: string
  matiere: string
  date: string
}

/*
Type XSD Format Exemple
xsd:date YYYY-MM-DD 2026-07-07
xsd:dateTime YYYY-MM-DDThh:mm:ss 2026-07-07T14:30:45
xsd:dateTime (UTC) YYYY-MM-DDThh:mm:ssZ 2026-07-07T12:30:45Z
xsd:dateTime (avec décalage) YYYY-MM-DDThh:mm:ss±hh:mm 2026-07-07T14:30:45+02:00
*/
