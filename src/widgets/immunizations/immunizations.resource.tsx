import { openmrsFetch } from "@openmrs/esm-api";
import { of } from "rxjs";

export function getImmunizationsConceptSet(
  vaccineConceptSetSearchText: string,
  abortController: AbortController
) {
  return openmrsFetch(`/ws/rest/v1/concept/${vaccineConceptSetSearchText}`, {
    signal: abortController.signal
  }).then(response => response.data);
}

export function performPatientImmunizationsSearch(
  patientIdentifier: string,
  patientUuid: string,
  abortController: AbortController
) {
  return openmrsFetch(`/ws/rest/v1/${patientUuid}/fhir/immunization`, {
    signal: abortController.signal
  }).then(response => response.data);
}

export function savePatientImmunization(
  patientImmunization,
  patientUuid,
  immunizationObsUuid,
  abortController
) {
  let immunizationEndpoint = `/ws/rest/v1/${patientUuid}/fhir/immunization`;
  if (immunizationObsUuid) {
    immunizationEndpoint = `${immunizationEndpoint}/${immunizationObsUuid}`;
  }
  return openmrsFetch(immunizationEndpoint, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: patientImmunization,
    signal: abortController.signal
  });
}
