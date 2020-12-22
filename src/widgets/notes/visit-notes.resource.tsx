import { openmrsFetch, openmrsObservableFetch } from "@openmrs/esm-api";

import { map } from "rxjs/operators";
import { visitNotePayload } from "./visit-note.util";
import { ConceptMapping, DiagnosisData } from "../types";

export function fetchAllLocations(abortController: AbortController) {
  return openmrsFetch("/ws/rest/v1/location?v=custom:(uuid,display)", {
    signal: abortController.signal
  });
}

export function fetchAllProviders(abortController: AbortController) {
  return openmrsFetch(
    "/ws/rest/v1/provider?v=custom:(person:(uuid,display),uuid)",
    {
      signal: abortController.signal
    }
  );
}

export function fetchDiagnosisByName(searchTerm: string) {
  return openmrsObservableFetch<Array<DiagnosisData>>(
    `/coreapps/diagnoses/search.action?&term=${searchTerm}`
  ).pipe(
    map(({ data }) => data),
    map((data: Array<DiagnosisData>) => formatDiangoses(data))
  );
}

function formatDiangoses(diagnoses: Array<DiagnosisData>): Array<Diagnosis> {
  return diagnoses.map(mapDiagnosisProperties);
}

function mapDiagnosisProperties(diagnosis: DiagnosisData): Diagnosis {
  return {
    concept: diagnosis.concept,
    conceptReferenceTermCode: getConceptReferenceTermCode(
      diagnosis.concept.conceptMappings
    ).conceptReferenceTerm.code,
    primary: false,
    confirmed: false
  };
}

export function fetchCurrentSessionData(abortController: AbortController) {
  return openmrsFetch(`/ws/rest/v1/appui/session`, {
    signal: abortController.signal
  });
}

export function saveVisitNote(
  abortController: AbortController,
  payload: visitNotePayload
) {
  return openmrsFetch(`/ws/rest/v1/encounter`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: payload,
    signal: abortController.signal
  });
}

function getConceptReferenceTermCode(conceptMapping: ConceptMapping[]): any {
  return conceptMapping.find(
    concept => concept.conceptReferenceTerm.conceptSource.name === "ICD-10-WHO"
  );
}

export interface Diagnosis {
  concept: any;
  conceptReferenceTermCode: number;
  primary: boolean;
  confirmed: boolean;
}
