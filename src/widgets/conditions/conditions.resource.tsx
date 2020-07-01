import { openmrsFetch } from "@openmrs/esm-api";
import { of } from "rxjs";
import { mockPatientConditionsResult } from "../../../__mocks__/conditions.mock";

export function performPatientConditionsSearch(
  patientIdentifier: string,
  abortController: AbortController
) {
  return Promise.resolve(mockPatientConditionsResult);
}

export function getConditionByUuid(conditionUuid: string) {
  return of(
    mockPatientConditionsResult.entry.find(
      res => res.resource.id === conditionUuid
    )
  );
}

export function savePatientCondition(
  patientCondition,
  patientUuid,
  abortController
) {
  return Promise.resolve({ status: 201, body: "Condition created" });
}

export function updatePatientCondition(
  patientCondition,
  patientUuid,
  abortController
) {
  return Promise.resolve({ status: 200, body: "Ok" });
}
