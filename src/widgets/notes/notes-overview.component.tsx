import React from "react";
import { match } from "react-router";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import {
  getEncounters,
  getEncounterObservableRESTAPI
} from "./encounter.resource";
import styles from "./notes-overview.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useRouteMatch } from "react-router-dom";
import { getNotes, formatNotesDate, getAuthorName } from "./notes-helper";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";

export default function NotesOverview(props: NotesOverviewProps) {
  const [patientNotes, setPatientNotes] = React.useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const notesPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    if (patient) {
      const sub = getEncounterObservableRESTAPI(
        patientUuid
      ).subscribe((response: any) => setPatientNotes(response.results));
      return () => sub.unsubscribe();
    }
  }, [patient, patientUuid]);

  function fhirNotesOverview() {
    return (
      <SummaryCard
        name="Notes"
        link={`${props.basePath}`}
        styles={{ margin: "1.25rem, 1.5rem" }}
      >
        <table className={styles.tableNotes}>
          <thead>
            <tr className={styles.tableNotesRow}>
              <th className={`${styles.tableNotesHeader} ${styles.tableDates}`}>
                Date
              </th>
              <th className={styles.tableNotesHeader}>
                Encounter type, Location
              </th>
              <th className={styles.tableNotesHeader}>Author</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patientNotes &&
              patientNotes.slice(0, 5).map(note => (
                <tr key={note.id} className={styles.tableNotesRow}>
                  <td className={styles.tableNotesDate}>
                    {formatNotesDate(note?.location[0].period.end)}
                  </td>
                  <td className={styles.tableNotesData}>
                    {note?.type[0]?.coding[0]?.display || "\u2014"}
                    <div className={styles.location}>
                      {note?.location[0]?.location?.display || "\u2014"}
                    </div>
                  </td>
                  <td className={styles.tableNotesAuthor}>
                    {getAuthorName(note) || "\u2014"}
                  </td>
                  <td
                    className={styles.tdLowerSvg}
                    style={{ textAlign: "end" }}
                  >
                    <svg
                      className="omrs-icon"
                      fill="var(--omrs-color-ink-low-contrast)"
                    >
                      <use xlinkHref="#omrs-icon-chevron-right" />
                    </svg>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <SummaryCardFooter linkTo={`${notesPath}`} />
      </SummaryCard>
    );
  }

  function restAPINotesOverview() {
    return (
      <SummaryCard
        name="Notes"
        link={`${props.basePath}`}
        styles={{ margin: "1.25rem, 1.5rem" }}
      >
        <table className={styles.tableNotes}>
          <thead>
            <tr className={styles.tableNotesRow}>
              <th className={`${styles.tableNotesHeader} ${styles.tableDates}`}>
                Date
              </th>
              <th className={styles.tableNotesHeader}>
                Encounter type, Location
              </th>
              <th className={styles.tableNotesHeader}>Author</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patientNotes &&
              patientNotes.slice(0, 5).map(note => (
                <tr key={note.uuid} className={styles.tableNotesRow}>
                  <td className={styles.tableNotesDate}>
                    {formatNotesDate(note?.encounterDatetime)}
                  </td>
                  <td className={styles.tableNotesData}>
                    {note.encounterType.name}
                    <div className={styles.location}>{note.location?.name}</div>
                  </td>
                  <td className={styles.tableNotesAuthor}>
                    {note?.auditInfo?.creator
                      ? String(note?.auditInfo?.creator?.display).toUpperCase()
                      : String(
                          note?.auditInfo?.changedBy?.display
                        ).toUpperCase()}
                  </td>
                  <td
                    className={styles.tdLowerSvg}
                    style={{ textAlign: "end" }}
                  >
                    <svg
                      className="omrs-icon"
                      fill="var(--omrs-color-ink-low-contrast)"
                    >
                      <use xlinkHref="#omrs-icon-chevron-right" />
                    </svg>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <SummaryCardFooter linkTo={`${notesPath}`} />
      </SummaryCard>
    );
  }

  return restAPINotesOverview();
}

type NotesOverviewProps = {
  basePath: string;
};
