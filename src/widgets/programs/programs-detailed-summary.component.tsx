import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useRouteMatch, Link } from "react-router-dom";
import dayjs from "dayjs";
import ProgramsForm from "./programs-form.component";
import { fetchEnrolledPrograms } from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { openWorkspaceTab } from "../shared-utils";
import { PatientProgram } from "../types";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./programs-detailed-summary.css";

export default function ProgramsDetailedSummary(
  props: ProgramsDetailedSummaryProps
) {
  const [enrolledPrograms, setEnrolledPrograms] = useState<
    Array<PatientProgram>
  >(null);
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();
  const match = useRouteMatch();

  useEffect(() => {
    if (patientUuid && !isLoadingPatient) {
      const subscription = fetchEnrolledPrograms(patientUuid).subscribe(
        enrolledPrograms => setEnrolledPrograms(enrolledPrograms),
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid, isLoadingPatient]);

  return (
    <>
      {enrolledPrograms?.length ? (
        <div className={styles.programsSummary}>
          <SummaryCard
            name={t("Care Programs")}
            styles={{
              width: "100%"
            }}
            addComponent={ProgramsForm}
            showComponent={() =>
              openWorkspaceTab(ProgramsForm, `${t("Programs Form")}`)
            }
          >
            <table className={`omrs-type-body-regular ${styles.programTable}`}>
              <thead>
                <tr>
                  <th>
                    <Trans i18nKey="Active Programs">Active Programs</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="Since">Since</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="Status">Status</Trans>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {enrolledPrograms?.map(program => {
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
                        <td>
                          {dayjs(program.dateEnrolled).format("MMM-YYYY")}
                        </td>
                        <td>
                          {program.dateCompleted ? (
                            <span className={styles.completionDate}>
                              <Trans i18nKey="Completed on">Completed on</Trans>{" "}
                              {dayjs(program.dateCompleted).format(
                                "DD-MMM-YYYY"
                              )}
                            </span>
                          ) : (
                            <Trans i18nKey="Active">Active</Trans>
                          )}
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
        </div>
      ) : (
        <EmptyState
          name={t("Care Programs")}
          showComponent={() =>
            openWorkspaceTab(
              ProgramsForm,
              `${t("Programs Form", "Programs Form")}`
            )
          }
          addComponent={ProgramsForm}
          displayText={t("program enrollments", "program enrollments")}
        />
      )}
    </>
  );
}

type ProgramsDetailedSummaryProps = {};
