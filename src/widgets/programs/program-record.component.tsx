import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import dayjs from "dayjs";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { getPatientProgramByUuid } from "./programs.resource";
import { openWorkspaceTab } from "../shared-utils";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import ProgramsForm from "./programs-form.component";
import styles from "./program-record.css";

export default function ProgramRecord(props: ProgramRecordProps) {
  const [patientProgram, setPatientProgram] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient && patientUuid) {
      const subscription = getPatientProgramByUuid(
        match.params["programUuid"]
      ).subscribe(program => {
        setPatientProgram(program), createErrorHandler();
      });

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patient, patientUuid, match.params]);

  return (
    <>
      {!!(patientProgram && Object.entries(patientProgram).length) && (
        <div className={styles.programSummary}>
          <SummaryCard
            name={t("program", "Program")}
            styles={{ width: "100%" }}
            editComponent={ProgramsForm}
            showComponent={() =>
              openWorkspaceTab(
                ProgramsForm,
                `${t("editProgram", "Edit Program")}`,
                {
                  program: patientProgram?.program?.name,
                  programUuid: patientProgram?.uuid,
                  enrollmentDate: patientProgram?.dateEnrolled,
                  completionDate: patientProgram?.dateCompleted,
                  location: patientProgram?.location?.uuid
                }
              )
            }
          >
            <div className={`omrs-type-body-regular ${styles.programCard}`}>
              <div>
                <p className="omrs-type-title-3" data-testid="program-name">
                  {patientProgram.program.name}
                </p>
              </div>
              <table className={styles.programTable}>
                <thead>
                  <tr>
                    <td>
                      <Trans i18nKey="enrolledOn">Enrolled on</Trans>
                    </td>
                    <td>
                      <Trans i18nKey="status">Status</Trans>
                    </td>
                    <td>
                      <Trans i18nKey="enrolledAt">Enrolled at</Trans>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {dayjs(patientProgram?.dateEnrolled).format(
                        "DD-MMM-YYYY"
                      )}
                    </td>
                    <td className={styles.completedProgram}>
                      {patientProgram?.dateCompleted ? (
                        <span className={styles.completionDate}>
                          <Trans i18nKey="completedOn">Completed on</Trans>{" "}
                          {dayjs(patientProgram?.dateCompleted).format(
                            "DD-MMM-YYYY"
                          )}
                        </span>
                      ) : (
                        <Trans i18nKey="active">Active</Trans>
                      )}
                    </td>
                    <td>
                      {patientProgram?.location
                        ? patientProgram?.location?.display
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SummaryCard>
        </div>
      )}
    </>
  );
}

type ProgramRecordProps = {};
