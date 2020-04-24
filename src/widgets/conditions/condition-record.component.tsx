import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { getConditionByUuid } from "./conditions.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient, newWorkspaceItem } from "@openmrs/esm-api";
import dayjs from "dayjs";
import styles from "./condition-record.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { ConditionsForm } from "./conditions-form.component";
import { openEditConditionsWorkspaceTab } from "./conditions-utils";

export default function ConditionRecord(props: ConditionRecordProps) {
  const [patientCondition, setPatientCondition] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = getConditionByUuid(match.params["conditionUuid"]).subscribe(
        ({ resource }) => setPatientCondition(resource),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, match.params]);

  function displayCondition() {
    return (
      <>
        <SummaryCard
          name="Condition"
          styles={{ width: "100%" }}
          editComponent={ConditionsForm}
          showComponent={() => {
            openEditConditionsWorkspaceTab(
              ConditionsForm,
              "Edit Conditions",
              patientCondition?.id,
              patientCondition?.code?.text,
              patientCondition?.clinicalStatus,
              patientCondition?.onsetDateTime
            );
          }}
        >
          <div className={`omrs-type-body-regular ${styles.conditionCard}`}>
            <div>
              <p className="omrs-type-title-3">
                {patientCondition?.code?.text}
              </p>
            </div>
            <table className={styles.conditionTable}>
              <thead>
                <tr>
                  <td>Onset date</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {dayjs(patientCondition?.onsetDateTime).format("MMM-YYYY")}
                  </td>
                  <td>{capitalize(patientCondition?.clinicalStatus)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SummaryCard>
      </>
    );
  }

  function displayDetails() {
    return (
      <SummaryCard
        name="Details"
        styles={{
          width: "100%",
          backgroundColor: "var(--omrs-color-bg-medium-contrast)"
        }}
      >
        <div className={`omrs-type-body-regular ${styles.conditionCard}`}>
          <table className={styles.conditionTable}>
            <thead>
              <tr>
                <td>Last updated</td>
                <td>Last updated by</td>
                <td>Last updated location</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {dayjs(patientCondition?.lastUpdated).format("DD-MMM-YYYY")}
                </td>
                <td>{patientCondition?.lastUpdatedBy}</td>
                <td>{patientCondition?.lastUpdatedLocation}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SummaryCard>
    );
  }

  return (
    <div className={styles.conditionContainer}>
      {patientCondition && (
        <div className={styles.conditionSummary}>{displayCondition()}</div>
      )}
      {patientCondition && (
        <div className={styles.conditionSummary}>{displayDetails()}</div>
      )}
    </div>
  );
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

type ConditionRecordProps = {};
