import React from "react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import {
  getEncounters,
  getEncounterObservableRESTAPI
} from "./encounter.resource";
import styles from "./notes-overview.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useRouteMatch, Link } from "react-router-dom";
import { getNotes, formatNotesDate, getAuthorName } from "./notes-helper";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash-es";
import { openWorkspaceTab } from "../shared-utils";
import VisitDashboard from "../visit/visit-dashboard-component";

export default function NotesOverview(props: NotesOverviewProps) {
  const [patientNotes, setPatientNotes] = React.useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  const { t } = useTranslation();
  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const notesPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    if (patient && patientUuid) {
      const sub = getEncounterObservableRESTAPI(patientUuid).subscribe(
        (response: any) => setPatientNotes(response.results),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [patient, patientUuid]);

  function fhirNotesOverview() {
    return (
      <SummaryCard name={t("Notes", "Notes")} styles={{ width: "100%" }}>
        <table className={`omrs-type-body-regular ${styles.notesTable}`}>
          <thead>
            <tr className={styles.notesTableRow}>
              <th>Date</th>
              <th style={{ textAlign: "left" }}>Encounter type, Location</th>
              <th>Author</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patientNotes &&
              patientNotes.slice(0, 5).map(note => (
                <tr key={note.id} className={styles.notesTableRow}>
                  <td className={styles.noteDate}>
                    {formatNotesDate(note?.location[0]?.period?.end)}
                  </td>
                  <td className={styles.noteInfo}>
                    <span>{note?.type[0]?.coding[0]?.display || "\u2014"}</span>
                    <div>
                      {note?.location[0]?.location?.display || "\u2014"}
                    </div>
                  </td>
                  <td className={styles.tableNotesAuthor}>
                    {getAuthorName(note) || "\u2014"}
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
    );
  }

  function restAPINotesOverview() {
    return (
      <SummaryCard
        name={t("Notes", "Notes")}
        styles={{ width: "100%" }}
        addComponent={VisitDashboard}
        showComponent={() =>
          openWorkspaceTab(VisitDashboard, "Visit Dashboard")
        }
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
            {patientNotes &&
              patientNotes.slice(0, 5).map(note => (
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
                      ? note?.encounterProviders[0].provider.person.display
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
    );
  }

  return restAPINotesOverview();
}

type NotesOverviewProps = {
  basePath: string;
};
