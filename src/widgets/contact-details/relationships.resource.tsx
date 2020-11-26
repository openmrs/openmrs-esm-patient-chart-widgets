import { openmrsFetch } from "@openmrs/esm-api";

export function fetchPatientRelationships(patientIdentifier: string) {
  return openmrsFetch<{ results: Relationship[] }>(
    `/ws/rest/v1/relationship?person=${patientIdentifier}`
  );
}

export type Relationship = {
  display: string;
  uuid: number;
};
