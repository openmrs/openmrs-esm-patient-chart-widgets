import React from "react";
import useLocations from "./use-locations";
import { Location } from "./location.resource";

export default function LocationSelect(props: LocationSelectProps) {
  const [locations] = useLocations();
  const onLocationsChanged = event => {
    props.onLocationChanged(
      locations.find(loc => loc.uuid == event.target.value)
    );
  };
  return (
    <>
      <select
        name="visitLocation"
        id={props.id || "visitLocation"}
        className="omrs-type-body-regular"
        style={{ height: "40px" }}
        value={props.currentLocationUuid}
        onChange={onLocationsChanged}
      >
        <option value={null} className="omrs-padding-8">
          {""}
        </option>
        {locations.map(location => {
          return (
            <option
              key={location.uuid}
              value={location.uuid}
              className="omrs-padding-8"
            >
              {location.display}
            </option>
          );
        })}
      </select>
    </>
  );
}

export type LocationSelectProps = {
  onLocationChanged: (selected: Location) => any;
  currentLocationUuid: string;
  id?: string;
};
