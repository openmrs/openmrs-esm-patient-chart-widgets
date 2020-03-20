import React, { useEffect, useState, Fragment } from "react";
import { useRouteMatch } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { fetchEncounterByUuid } from "./encounter.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import styles from "./note-record.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import dayjs from "dayjs";

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

  function displayNote() {
    return (
      <>
        {note && (
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
        )}
      </>
    );
  }

  function displayNoteDetails() {
    return (
      <>
        {note.obs && note.obs.length && (
          <SummaryCard
            name="Details"
            styles={{
              width: "100%",
              backgroundColor: "var(--omrs-color-bg-medium-contrast)"
            }}
          >
            <div className={`omrs-type-body-regular ${styles.noteCard}`}>
              {note.obs.map(ob => {
                return (
                  <Fragment key={ob.uuid}>
                    <p>{ob.display}</p>
                  </Fragment>
                );
              })}
            </div>
          </SummaryCard>
        )}
      </>
    );
  }

  return (
    <div className={styles.noteContainer}>
      {note && <div className={styles.noteSummary}>{displayNote()}</div>}
      {note && note.obs.length ? (
        <div className={styles.noteSummary}>{displayNoteDetails()}</div>
      ) : (
        ""
      )}
    </div>
  );
}

type NoteRecordProps = {};
