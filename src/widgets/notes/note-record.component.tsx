import React, { useEffect, useState, Fragment } from "react";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
import styles from "./note-record.css";
import { match, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrentPatient, createErrorHandler } from "@openmrs/esm-framework";
import { fetchEncounterByUuid } from "./encounter.resource";

export default function NoteRecord(props: NoteRecordProps) {
  const [note, setNote] = useState(null);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const match: match<TParams> = useRouteMatch();
  const { params } = match;
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient && params) {
      const sub = fetchEncounterByUuid(params["encounterUuid"]).subscribe(
        note => setNote(note),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, params]);

  return (
    <>
      {!!(note && Object.entries(note).length) && (
        <div className={styles.noteContainer}>
          <SummaryCard name={t("note", "Note")} styles={{ width: "100%" }}>
            <div className={`omrs-type-body-regular ${styles.noteCard}`}>
              <div>
                <p className="omrs-type-title-3">{note?.display}</p>
              </div>
              <table className={styles.noteTable}>
                <thead>
                  <tr>
                    <td>{t("encounterType", "Encounter type")}</td>
                    <td>{t("location", "Location")}</td>
                    <td>{t("encounterDate", "Encounter date")}</td>
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

type TParams = {
  encounterUuid: string;
};
