import { useState, useEffect } from "react";
import { Subscription } from "rxjs";
import { openmrsObservableFetch } from "@openmrs/esm-api";

export default function useSessionUser() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  useEffect(() => {
    let currentUserSub: Subscription;
    if (sessionUser === null) {
      currentUserSub = openmrsObservableFetch("/ws/rest/v1/session").subscribe(
        user => {
          setSessionUser(user.data);
        }
      );
    }
    return () => currentUserSub && currentUserSub.unsubscribe();
  }, []);
  return [sessionUser];
}
