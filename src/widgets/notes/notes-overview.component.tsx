import React from "react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { getEncounterObservableRESTAPI } from "./encounter.resource";
import styles from "./notes-overview.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { Link } from "react-router-dom";
import { formatNotesDate } from "./notes-helper";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { useTranslation } from "react-i18next";
import useChartBasePath from "../../utils/use-chart-base";
import { PatientNotes, widgetBasePath } from "../types";
import { openWorkspaceTab } from "../shared-utils";
import VisitNotes from "./visit-note.component";

export default function NotesOverview(props: NotesOverviewProps) {
  const [patientNotes, setPatientNotes] = React.useState<Array<PatientNotes>>();
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const {
    props: { basePath }
  } = props;
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
    <>
      {patientNotes?.length > 0 ? (
        <SummaryCard
          name={t("Notes")}
          showComponent={() =>
            openWorkspaceTab(VisitNotes, `${t("Visit Notes")}`)
          }
          addComponent={VisitNotes}
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
          name={t("Notes")}
          showComponent={() =>
            openWorkspaceTab(VisitNotes, `${t("Visit Notes")}`)
          }
          addComponent={VisitNotes}
          displayText={t("notes")}
        />
      )}
    </>
  );
}

type NotesOverviewProps = {
  props: widgetBasePath;
};
