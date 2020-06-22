import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { getConditionByUuid } from "./conditions.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import styles from "./condition-record.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { ConditionsForm } from "./conditions-form.component";
import { openWorkspaceTab } from "../shared-utils";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
import useChartBasePath from "../../utils/use-chart-base";

export default function ConditionRecord(props: ConditionRecordProps) {
  const [patientCondition, setPatientCondition] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
  const chartBasePath = useChartBasePath();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = getConditionByUuid(match.params["conditionUuid"]).subscribe(
        ({ resource }) => setPatientCondition(resource),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, match.params]);

  return (
    <>
      {!!(patientCondition && Object.entries(patientCondition).length) && (
        <div className={styles.conditionContainer}>
          <SummaryCard
            name="Condition"
            styles={{ width: "100%" }}
            editComponent={ConditionsForm}
            showComponent={() => {
              openWorkspaceTab(ConditionsForm, "Edit Conditions", {
                conditionUuid: patientCondition?.id,
                conditionName: patientCondition?.code?.text,
                clinicalStatus: patientCondition?.clinicalStatus,
                onsetDateTime: patientCondition?.onsetDateTime
              });
            }}
            link={`${chartBasePath}/conditions`}
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
                      {dayjs(patientCondition?.onsetDateTime).format(
                        "MMM-YYYY"
                      )}
                    </td>
                    <td>{capitalize(patientCondition?.clinicalStatus)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SummaryCard>
          <RecordDetails>
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
          </RecordDetails>
        </div>
      )}
    </>
  );
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

type ConditionRecordProps = {};
