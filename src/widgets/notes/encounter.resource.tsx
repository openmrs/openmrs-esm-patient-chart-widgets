import {
  openmrsFetch,
  openmrsObservableFetch,
  fhirBaseUrl
} from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PatientNotes } from "../types";

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

export function getEncounterObservableRESTAPI(patientUuid: string) {
  return openmrsObservableFetch<{ results: Array<PatientNotes> }>(
    `/ws/rest/v1/encounter?patient=${patientUuid}&v=custom:(uuid,display,encounterDatetime,location:(uuid,display,name),encounterType:(name,uuid),auditInfo:(creator:(display),changedBy:(display)),encounterProviders:(provider:(person:(display))))`
  ).pipe(
    map(({ data }) => data.results),
    map(notes => {
      return formatNotes(notes);
    }),
    map(data =>
      data.sort((a, b) => (a.encounterDatetime < b.encounterDatetime ? 1 : -1))
    )
  );
}

export function fetchEncounterByUuid(encounterUuid): Observable<any> {
  return openmrsObservableFetch(`/ws/rest/v1/encounter/${encounterUuid}`).pipe(
    map(({ data }) => data)
  );
}

function formatNotes(notes: Array<any>): Array<any> {
  let formattedNotes: Array<any> = [];
  notes.forEach((note: PatientNotes) => {
    formattedNotes.push(mapNoteProperties(note));
  });
  return formattedNotes;
}

function mapNoteProperties(note: PatientNotes): any {
  const formattedNote: any = {
    id: note.uuid,
    encounterDate: note.encounterDatetime.slice(0, 19),
    encounterType: note.encounterType?.name,
    encounterLocation: note.location?.display,
    encounterAuthor: note.encounterProviders[0]?.provider?.person?.display
  };
  return formattedNote;
}
