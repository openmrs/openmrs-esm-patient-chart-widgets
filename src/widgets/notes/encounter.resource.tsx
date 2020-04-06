import {
  openmrsFetch,
  openmrsObservableFetch,
  newWorkspaceItem
} from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export function getEncounters(
  patientIdentifer: string,
  abortController: AbortController
) {
  return openmrsFetch(`/ws/fhir/Encounter?identifier=${patientIdentifer}`, {
    signal: abortController.signal
  });
}

export function getEncounterById(encounterId: string) {
  return openmrsFetch(`/ws/fhir/Encounter?${encounterId}`);
}

export function getEncounterByUuid(encounterUuid: string) {
  return openmrsFetch(`/ws/fhir/Encounter?_id=${encounterUuid}`);
}

export function searchEncounterByPatientIdentifierWithMatchingVisit(
  patientIdentifer: string,
  visitUuid: string
) {
  return openmrsFetch(
    `/ws/fhir/Encounter?identifier=${patientIdentifer},part-of=${visitUuid}`
  );
}

export function getEncounterObservableRESTAPI(patientUuid) {
  return openmrsObservableFetch(
    `/ws/rest/v1/encounter?patient=${patientUuid}&v=custom:(uuid,display,encounterDatetime,location:(uuid,display,name),encounterType:(name,uuid),auditInfo:(creator:(display),changedBy:(display)),encounterProviders:(provider:(person:(display))))`
  ).pipe(map(response => response.data));
}

export function fetchEncounterByUuid(encounterUuid): Observable<any> {
  return openmrsObservableFetch(`/ws/rest/v1/encounter/${encounterUuid}`).pipe(
    map(({ data }) => data)
  );
}

export const openVisitsNoteWorkspace = (componentName, title) => {
  newWorkspaceItem({
    component: componentName,
    name: title,
    props: {
      match: {
        params: {
          orderUuid: null,
          drugName: null,
          action: "NEW"
        }
      }
    },
    inProgress: false,
    validations: (workspaceTabs: any[]) =>
      workspaceTabs.findIndex(tab => tab.component === componentName)
  });
};
