import {
  openmrsFetch,
  openmrsObservableFetch,
  fhirBaseUrl
} from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export function getEncounters(
  patientIdentifer: string,
  abortController: AbortController
) {
  return openmrsFetch(
    `${fhirBaseUrl}/Encounter?identifier=${patientIdentifer}`,
    {
      signal: abortController.signal
    }
  );
}

export function getEncounterById(encounterId: string) {
  return openmrsFetch(`${fhirBaseUrl}/Encounter?${encounterId}`);
}

export function getEncounterByUuid(encounterUuid: string) {
  return openmrsFetch(`${fhirBaseUrl}/Encounter?_id=${encounterUuid}`);
}

export function searchEncounterByPatientIdentifierWithMatchingVisit(
  patientIdentifer: string,
  visitUuid: string
) {
  return openmrsFetch(
    `${fhirBaseUrl}/Encounter?identifier=${patientIdentifer},part-of=${visitUuid}`
  );
}

export function getEncounterObservableRESTAPI(patientUuid) {
  return openmrsObservableFetch(
    `/ws/rest/v1/encounter?patient=${patientUuid}&v=custom:(uuid,display,encounterDatetime,location:(uuid,display,name),encounterType:(name,uuid),auditInfo:(creator:(display),changedBy:(display)),encounterProviders:(provider:(person:(display))))`
  ).pipe(map((response: any) => response.data));
}

export function fetchEncounterByUuid(encounterUuid): Observable<any> {
  return openmrsObservableFetch(`/ws/rest/v1/encounter/${encounterUuid}`).pipe(
    map(({ data }) => data)
  );
}
