import React, { useState, useEffect } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useRouteMatch } from "react-router-dom";
import { fetchVitalSignByUuid } from "./vitals-card.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";

export default function VitalRecord(props: VitalRecordProps) {
  const [vital, setVital] = useState(null);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const match = useRouteMatch();

  useEffect(() => {
    if (!isLoadingPatient && patient && match.params) {
      const sub = fetchVitalSignByUuid(match.params["vitalUuid"]).subscribe(
        vital => setVital(vital),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, match.params]);

  return <>VitalRecord works!</>;
}

type VitalRecordProps = {};
