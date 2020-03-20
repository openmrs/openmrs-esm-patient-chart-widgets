import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { fetchEncounterByUuid } from "./encounter.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";

export default function NoteRecord(props: NoteRecordProps) {
  const [note, setNote] = useState(null);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const match = useRouteMatch();

  useEffect(() => {
    if (!isLoadingPatient && patient && match.params) {
      const sub = fetchEncounterByUuid(match.params["encounterUuid"]).subscribe(
        note => setNote(note),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, match.params]);

  return <>NoteRecord works!</>;
}

type NoteRecordProps = {};
