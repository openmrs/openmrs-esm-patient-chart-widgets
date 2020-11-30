import { openmrsFetch } from "@openmrs/esm-api";

export function fetchPatientRelationships(patientIdentifier: string) {
  return openmrsFetch<{ results: Relationship[] }>(
    `/ws/rest/v1/relationship?v=full&person=${patientIdentifier}`
  );
}

export type Relationship = {
  display: string;
  uuid: number;
  personA: {
    age: number;
    display: string;
    uuid: string;
  };
  personB: {
    age: number;
    display: string;
    uuid: string;
  };
  relationshipType: {
    uuid: string;
    display: string;
    aIsToB: string;
    bIsToA: string;
  };
};
