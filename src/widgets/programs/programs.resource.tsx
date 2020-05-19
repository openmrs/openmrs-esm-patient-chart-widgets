import { openmrsObservableFetch, openmrsFetch } from "@openmrs/esm-api";
import { Observable, of } from "rxjs";
import { map, take } from "rxjs/operators";

export function fetchEnrolledPrograms(
  patientID: string
): Observable<PatientProgram[]> {
  return openmrsObservableFetch(
    `/ws/rest/v1/programenrollment?patient=${patientID}`
  ).pipe(
    map(
      ({ data }) =>
        data["results"].sort((a, b) =>
          b.dateEnrolled > a.dateEnrolled ? 1 : -1
        ),
      take(3)
    )
  );
}

export function fetchActiveEnrollments(
  patientID: string
): Observable<PatientProgram[]> {
  return openmrsObservableFetch(
    `/ws/rest/v1/programenrollment?patient=${patientID}`
  ).pipe(
    map(({ data }) => {
      return data["results"]
        .filter(res => !res.dateCompleted)
        .sort((a, b) => (b.dateEnrolled > a.dateEnrolled ? 1 : -1));
    })
  );
}

export function getPatientProgramByUuid(
  programUuid: string
): Observable<PatientProgram> {
  return openmrsObservableFetch(
    `/ws/rest/v1/programenrollment/${programUuid}`
  ).pipe(map(({ data }) => mapToPatientProgram(data)));
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

function mapToPatientProgram(data: any): PatientProgram {
  return { ...data };
}

export function fetchPrograms(): Observable<any> {
  return openmrsObservableFetch(
    `/ws/rest/v1/program?v=custom:(uuid,display,allWorkflows,concept:(uuid,display))`
  ).pipe(map(({ data }) => data["results"]));
}

export function fetchLocations(): Observable<any> {
  return openmrsObservableFetch(
    `/ws/rest/v1/location?v=custom:(uuid,display)`
  ).pipe(map(({ data }) => data["results"]));
}

export function getSession(abortController: AbortController) {
  return openmrsFetch(`/ws/rest/v1/appui/session`, {
    signal: abortController.signal
  });
}

type PatientProgram = {
  uuid: String;
  program: {};
  display: String;
  dateEnrolled: Date;
  dateCompleted: Date;
  links: [];
};
