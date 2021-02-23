import { openmrsObservableFetch } from "@openmrs/esm-framework";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

export function getVisitTypes(): Observable<Array<VisitType>> {
  return openmrsObservableFetch(`/ws/rest/v1/visittype`)
    .pipe(
      map(results => {
        const visitTypes: Array<VisitType> = results["data"][
          "results"
        ].map(visitType => toVisitTypeObject(visitType));
        return visitTypes;
      })
    )
    .pipe(take(1));
}

export type VisitType = {
  uuid: string;
  display: string;
  name?: string;
};

export function toVisitTypeObject(openmrsRestForm: any): VisitType {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
    name: openmrsRestForm.name
  };
}
