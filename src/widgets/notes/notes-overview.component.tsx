import React from "react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import {
  getEncounters,
  getEncounterObservableRESTAPI
} from "./encounter.resource";
import styles from "./notes-overview.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { Link } from "react-router-dom";
import { getNotes, formatNotesDate, getAuthorName } from "./notes-helper";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash-es";
import useChartBasePath from "../../utils/use-chart-base";
import { PatientNotes } from "../types";

export default function NotesOverview(props: NotesOverviewProps) {
  const [patientNotes, setPatientNotes] = React.useState<Array<PatientNotes>>();
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const notesPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    if (patient && patientUuid) {
      const sub = getEncounterObservableRESTAPI(patientUuid).subscribe(
        patientVisitNote => setPatientNotes(patientVisitNote),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [patient, patientUuid]);

  return (
    <>
      {patientNotes && patientNotes.length > 0 ? (
        <SummaryCard
          name={t("Notes", "Notes")}
          styles={{ width: "100%" }}
          link={notesPath}
        >
          <table className={`omrs-type-body-regular ${styles.notesTable}`}>
            <thead>
              <tr className={styles.notesTableRow}>
                <th>Date</th>
                <th style={{ textAlign: "left" }}>Encounter type, Location</th>
                <th style={{ textAlign: "left" }}>Author</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patientNotes.slice(0, 5).map(note => (
                <tr key={note.uuid} className={styles.notesTableRow}>
                  <td className={styles.noteDate}>
                    {formatNotesDate(note?.encounterDatetime)}
                  </td>
                  <td className={styles.noteInfo}>
                    <span>{note?.encounterType?.name}</span>
                    <div>{note?.location?.name}</div>
                  </td>
                  <td className={styles.noteAuthor}>
                    {!isEmpty(note.encounterProviders)
                      ? note?.encounterProviders[0]?.provider?.person?.display
                      : "\u2014"}
                  </td>
                  <td>
                    <Link to={`${notesPath}/${note.uuid}`}>
                      <svg
                        className="omrs-icon"
                        fill="var(--omrs-color-ink-low-contrast)"
                      >
                        <use xlinkHref="#omrs-icon-chevron-right" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <SummaryCardFooter linkTo={notesPath} />
        </SummaryCard>
      ) : (
        <EmptyState
          name="Notes"
          displayText="This patient has no notes recorded in the system."
        />
      )}
    </>
  );
}

type NotesOverviewProps = {
  basePath: string;
};
