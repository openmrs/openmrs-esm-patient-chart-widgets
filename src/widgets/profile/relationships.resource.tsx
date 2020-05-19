import { openmrsFetch, fhirBaseUrl } from "@openmrs/esm-api";

export function fetchPatientRelationships(patientIdentifier: string) {
  return openmrsFetch(
    `${fhirBaseUrl}/RelatedPerson?patient.identifier=${patientIdentifier}`
  );
}
