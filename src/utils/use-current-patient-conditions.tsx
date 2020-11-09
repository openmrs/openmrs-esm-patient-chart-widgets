import { useState, useEffect } from "react";

import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import {
  Condition,
  fetchAllConditions
} from "../widgets/conditions/conditions.resource";

export function useCurrentPatientConditions() {
  const [, patient, patientUuid] = useCurrentPatient();
  const [conditions, setConditions] = useState<Array<Condition>>(null);

  const fetchActiveConditions = () => {
    return fetchAllConditions(patient.identifier[0].value).subscribe(
      conditions => {
        const activeConditions = conditions
          .filter(
            condition => condition.clinicalStatus === ACTIVE_CONDITION.KEY
          )
          .sort((a, b) => (b?.onsetDateTime > a?.onsetDateTime ? 1 : -1));
        setConditions(activeConditions);
      },
      createErrorHandler()
    );
  };

  useEffect(() => {
    if (patient) {
      const sub = fetchActiveConditions();
      return () => sub.unsubscribe();
    }
  }, [patient]);

  return [conditions, fetchActiveConditions];
}

enum ACTIVE_CONDITION {
  "KEY" = "active"
}
