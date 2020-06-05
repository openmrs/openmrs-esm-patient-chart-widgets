import React, { useEffect, useState, Fragment } from "react";
import { useRouteMatch } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { fetchEncounterByUuid } from "./encounter.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import styles from "./note-record.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import dayjs from "dayjs";
import RecordDetails from "../../ui-components/cards/record-details-card.component";

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

  return (
    <>
      {!!(note && Object.entries(note).length) && (
        <div className={styles.noteContainer}>
          <SummaryCard name="Note" styles={{ width: "100%" }}>
            <div className={`omrs-type-body-regular ${styles.noteCard}`}>
              <div>
                <p className="omrs-type-title-3">{note?.display}</p>
              </div>
              <table className={styles.noteTable}>
                <thead>
                  <tr>
                    <td>Encounter type</td>
                    <td>Location</td>
                    <td>Encounter datetime</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{note?.encounterType?.display}</td>
                    <td>{note?.location?.display}</td>
                    <td>
                      {dayjs(note?.encounterDatetime).format("DD-MM-YYYY")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SummaryCard>
          {note.obs && note.obs.length && (
            <RecordDetails>
              {note.obs.map(ob => {
                return (
                  <Fragment key={ob.uuid}>
                    <p>{ob.display}</p>
                  </Fragment>
                );
              })}
            </RecordDetails>
          )}
        </div>
      )}
    </>
  );
}

type NoteRecordProps = {};
