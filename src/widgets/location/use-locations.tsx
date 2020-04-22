import { useState, useEffect } from "react";
import { Subscription } from "rxjs";
import { Location, getLocations } from "./location.resource";

export default function useLocations() {
  const [locations, setLocations] = useState<Array<Location>>([]);
  useEffect(() => {
    const locationSub = getLocations().subscribe(
      locations => {
        setLocations(locations);
      },
      error => {
        console.error(error);
      }
    );
    return () => locationSub.unsubscribe();
  }, []);
  return [locations];
}
