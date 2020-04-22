import { openmrsFetch, newWorkspaceItem } from "@openmrs/esm-api";

export function getPatientVisits(
  patientUuid: string,
  abortController: AbortController
) {
  return openmrsFetch(
    `/ws/rest/v1/visit?patient=${patientUuid}&v=custom:(uuid,patient:(uuid,display),visitType:(uuid,display),location:(uuid,display),startDatetime,stopDatetime,encounters)`,
    { signal: abortController.signal }
  );
}
