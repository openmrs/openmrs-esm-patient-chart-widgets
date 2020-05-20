import { openmrsObservableFetch, openmrsFetch } from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FetchResponse } from "@openmrs/esm-api/dist/openmrs-fetch";
import { PatientProgram, Program, LocationData, SessionData } from "../types";

export function fetchEnrolledPrograms(
  patientID: string
): Observable<PatientProgram[]> {
  return openmrsObservableFetch<FetchResponse<PatientProgram[]>>(
    `/ws/rest/v1/programenrollment?patient=${patientID}`
  ).pipe(
    map(
      ({ data }: { data: FetchResponse<PatientProgram[]> }) => data["results"]
    ),
    map((results: PatientProgram[]) =>
      results.sort((a, b) => (b.dateEnrolled > a.dateEnrolled ? 1 : -1))
    )
  );
}

export function fetchActiveEnrollments(
  patientID: string
): Observable<PatientProgram[]> {
  return openmrsObservableFetch<FetchResponse<PatientProgram[]>>(
    `/ws/rest/v1/programenrollment?patient=${patientID}`
  ).pipe(
    map(
      ({ data }: { data: FetchResponse<PatientProgram[]> }) => data["results"]
    ),
    map((results: PatientProgram[]) =>
      results
        .filter(res => !res.dateCompleted)
        .sort((a, b) => (b.dateEnrolled > a.dateEnrolled ? 1 : -1))
    )
  );
}

export function getPatientProgramByUuid(
  programUuid: string
): Observable<PatientProgram> {
  return openmrsObservableFetch<FetchResponse<PatientProgram>>(
    `/ws/rest/v1/programenrollment/${programUuid}`
  ).pipe(
    map(({ data }: { data: FetchResponse<PatientProgram> }) =>
      mapToPatientProgram(data)
    )
  );
}

function mapToPatientProgram(data): PatientProgram {
  return { ...data };
}

export function createProgramEnrollment(payload, abortController) {
  if (!payload) {
    return null;
  }
  const { program, patient, dateEnrolled, dateCompleted, location } = payload;
  return openmrsObservableFetch(`/ws/rest/v1/programenrollment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: { program, patient, dateEnrolled, dateCompleted, location },
    signal: abortController.signal
  });
}

export function updateProgramEnrollment(payload, abortController) {
  if (!payload && !payload.program) {
    return null;
  }
  const { program, dateEnrolled, dateCompleted, location } = payload;
  return openmrsObservableFetch(`/ws/rest/v1/programenrollment/${program}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: { dateEnrolled, dateCompleted, location },
    signal: abortController.signal
  });
}

export function fetchPrograms(): Observable<Program[]> {
  return openmrsObservableFetch<FetchResponse<Program[]>>(
    `/ws/rest/v1/program?v=custom:(uuid,display,allWorkflows,concept:(uuid,display))`
  ).pipe(
    map(({ data }: { data: FetchResponse<Program[]> }) => data["results"]),
    map((results: Program[]) => results)
  );
}

export function fetchLocations(): Observable<LocationData[]> {
  return openmrsObservableFetch<FetchResponse<LocationData[]>>(
    `/ws/rest/v1/location?v=custom:(uuid,display)`
  ).pipe(
    map(({ data }) => data["results"]),
    map((results: LocationData[]) => results)
  );
}

export function getSession(
  abortController: AbortController
): Promise<FetchResponse<SessionData>> {
  return openmrsFetch(`/ws/rest/v1/appui/session`, {
    signal: abortController.signal
  });
}
