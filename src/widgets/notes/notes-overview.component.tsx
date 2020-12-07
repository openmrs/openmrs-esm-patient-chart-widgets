import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { getEncounterObservableRESTAPI } from "./encounter.resource";
import { formatNotesDate } from "./notes-helper";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import useChartBasePath from "../../utils/use-chart-base";
import { PatientNotes } from "../types";
import { openWorkspaceTab } from "../shared-utils";
import VisitNotes from "./visit-note.component";
import styles from "./notes-overview.css";

export default function NotesOverview({ basePath }: NotesOverviewProps) {
  const [patientNotes, setPatientNotes] = React.useState<Array<PatientNotes>>();
  const [, patient, patientUuid] = useCurrentPatient();
  const chartBasePath = "/patient/:patientUuid/chart";
  const notesPath = chartBasePath + "/" + basePath;
  const { t } = useTranslation();

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
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      {patientNotes?.length > 0 ? (
        <SummaryCard
          name={t("notes", "Notes")}
          showComponent={() =>
            openWorkspaceTab(VisitNotes, `${t("visitNotes", "Visit Notes")}`)
          }
          addComponent={VisitNotes}
          styles={{ width: "100%" }}
          link={notesPath}
        >
          <table className={`omrs-type-body-regular ${styles.notesTable}`}>
            <thead>
              <tr className={styles.notesTableRow}>
                <th>{t("date", "Date")}</th>
                <th style={{ textAlign: "left" }}>
                  {t("encounterType", "Encounter type")},{" "}
                  {t("location", "Location")}
                </th>
                <th style={{ textAlign: "left" }}>{t("author", "author")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patientNotes
                ?.filter(note => !!note)
                .slice(0, 5)
                .map(note => (
                  <tr key={note.uuid} className={styles.notesTableRow}>
                    <td className={styles.noteDate}>
                      {formatNotesDate(note.encounterDatetime)}
                    </td>
                    <td className={styles.noteInfo}>
                      <span>{note.encounterType?.name}</span>
                      <div>{note.location?.name}</div>
                    </td>
                    <td className={styles.noteAuthor}>
                      {note.encounterProviders.length
                        ? note.encounterProviders[0].provider?.person?.display
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
          displayText={t("notes", "notes")}
          headerTitle={t("notes", "Notes")}
          launchForm={() =>
            openWorkspaceTab(VisitNotes, `${t("visitNotes", "Visit Notes")}`)
          }
        />
      )}
    </BrowserRouter>
  );
}

type NotesOverviewProps = {
  basePath: string;
};
