import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { getPatientProgramByUuid } from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./program-record.css";
import dayjs from "dayjs";
import ProgramsForm from "./programs-form.component";
import { openWorkspaceTab } from "../shared-utils";

export default function ProgramRecord(props: ProgramRecordProps) {
  const [patientProgram, setPatientProgram] = React.useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();

  React.useEffect(() => {
    if (!isLoadingPatient && patient && patientUuid) {
      const subscription = getPatientProgramByUuid(
        match.params["programUuid"]
      ).subscribe(program => setPatientProgram(program), createErrorHandler());

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patient, patientUuid, match.params]);

  return (
    <>
      {patientProgram && (
        <div className={styles.programSummary}>
          <SummaryCard
            name="Program"
            styles={{ width: "100%" }}
            editComponent={ProgramsForm}
            showComponent={() =>
              openWorkspaceTab(ProgramsForm, "Edit Program", {
                program: patientProgram?.program?.name,
                programUuid: patientProgram?.uuid,
                enrollmentDate: patientProgram?.dateEnrolled,
                completionDate: patientProgram?.dateCompleted,
                location: patientProgram?.location?.uuid
              })
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
                    <td>Enrolled on</td>
                    <td>Status</td>
                    <td>Enrolled at</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {dayjs(patientProgram?.dateEnrolled).format(
                        "DD-MMM-YYYY"
                      )}
                    </td>
                    <td>
                      {patientProgram?.dateCompleted
                        ? `Completed on ${dayjs(
                            patientProgram?.dateCompleted
                          ).format("DD-MMM-YYYY")}`
                        : "Active"}
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
