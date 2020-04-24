import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import ProgramsForm from "./programs-form.component";
import { fetchEnrolledPrograms } from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useTranslation } from "react-i18next";
import { match, useRouteMatch, Link } from "react-router-dom";
import styles from "./programs-detailed-summary.css";
import { openWorkspaceTab } from "../shared-utils";

export default function ProgramsDetailedSummary(
  props: ProgramsDetailedSummaryProps
) {
  const [patientPrograms, setPatientPrograms] = React.useState(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { t } = useTranslation();
  const match = useRouteMatch();

  useEffect(() => {
    if (patientUuid) {
      const subscription = fetchEnrolledPrograms(patientUuid).subscribe(
        enrolledPrograms => setEnrolledPrograms(enrolledPrograms),
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  function displayPrograms() {
    return (
      <SummaryCard
        name="Care Programs"
        styles={{
          width: "100%"
        }}
        addComponent={ProgramsForm}
        showComponent={() => openWorkspaceTab(ProgramsForm, "Programs Form")}
      >
        <table className={`omrs-type-body-regular ${styles.programTable}`}>
          <thead>
            <tr>
              <td>ACTIVE PROGRAMS</td>
              <td>SINCE</td>
              <td>STATUS</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {enrolledPrograms &&
              enrolledPrograms.map(program => {
                return (
                  <React.Fragment key={program.uuid}>
                    <tr
                      className={`${
                        program.dateCompleted
                          ? `${styles.inactive}`
                          : `${styles.active}`
                      }`}
                    >
                      <td className="omrs-medium">{program.display}</td>
                      <td>{dayjs(program.dateEnrolled).format("MMM-YYYY")}</td>
                      <td>
                        {program.dateCompleted
                          ? `Completed on ${dayjs(program.dateCompleted).format(
                              "DD-MMM-YYYY"
                            )}`
                          : "Active"}
                      </td>
                      <td>
                        {
                          <Link to={`${match.path}/${program.uuid}`}>
                            <svg
                              className="omrs-icon"
                              fill="var(--omrs-color-ink-low-contrast)"
                            >
                              <use xlinkHref="#omrs-icon-chevron-right" />
                            </svg>
                          </Link>
                        }
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </SummaryCard>
    );
  }

  function displayNoPrograms() {
    return (
      <SummaryCard
        name="Care Programs"
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-low-contrast)",
          border: "none",
          boxShadow: "none"
        }}
      >
        <div className={styles.emptyPrograms}>
          <p data-testid="no-programs">
            Program data will appear here once the patient enrolls into a
            program.
          </p>
          <p>
            <button
              className="omrs-btn omrs-outlined-action"
              onClick={() => openWorkspaceTab(ProgramsForm, "Programs Form")}
            >
              Enroll in a program
            </button>
          </p>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {enrolledPrograms && (
        <div className={styles.programsSummary}>
          {enrolledPrograms.length > 0
            ? displayPrograms()
            : displayNoPrograms()}
        </div>
      )}
    </>
  );
}

type ProgramsDetailedSummaryProps = {};
