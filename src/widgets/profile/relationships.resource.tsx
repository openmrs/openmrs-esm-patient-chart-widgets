import { openmrsFetch, fhirBaseUrl } from "@openmrs/esm-api";

export function fetchPatientRelationships(patientIdentifier: string) {
  return openmrsFetch(`/ws/rest/v1/relationship?person=${patientIdentifier}`);
}
