import { openmrsFetch, fhirConfig } from "@openmrs/esm-api";

export function fetchPatientRelationships(patientIdentifier: string) {
  return openmrsFetch(
    `${fhirConfig.baseUrl}/RelatedPerson?patient.identifier=${patientIdentifier}`
  );
}
