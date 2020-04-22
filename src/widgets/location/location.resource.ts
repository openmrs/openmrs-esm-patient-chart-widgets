import { openmrsObservableFetch } from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

export function getLocations(): Observable<Array<Location>> {
  return openmrsObservableFetch(`/ws/rest/v1/location`)
    .pipe(
      map(results => {
        const locations: Location[] = results["data"]["results"].map(location =>
          toLocationObject(location)
        );
        return locations;
      })
    )
    .pipe(take(1));
}

export type Location = {
  uuid: string;
  display: string;
};

export function toLocationObject(openmrsRestForm: any): Location {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display
  };
}
