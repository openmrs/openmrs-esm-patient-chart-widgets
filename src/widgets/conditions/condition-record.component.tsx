import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { capitalize } from "lodash-es";
import dayjs from "dayjs";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
import { ConditionsForm } from "./conditions-form.component";
import { getConditionByUuid } from "./conditions.resource";
import styles from "./condition-record.css";

export default function ConditionRecord(props: ConditionRecordProps) {
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const match = useRouteMatch();
  const [patientCondition, setPatientCondition] = useState(null);
  const [isLoadingPatient, patient] = useCurrentPatient();

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
            name={t("Condition", "Condition")}
            styles={{ width: "100%" }}
            editComponent={ConditionsForm}
            showComponent={() => {
              openWorkspaceTab(
                ConditionsForm,
                `${t("Edit Condition", "Edit Condition")}`,
                {
                  conditionUuid: patientCondition?.id,
                  conditionName: patientCondition?.code?.text,
                  clinicalStatus: patientCondition?.clinicalStatus,
                  onsetDateTime: patientCondition?.onsetDateTime
                }
              );
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
                    <th>
                      <Trans i18nKey="Onset date">Onset date</Trans>
                    </th>
                    <th>
                      <Trans i18nKey="Status">Status</Trans>
                    </th>
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
                  <th>
                    <Trans i18nKey="Last updated">Last updated</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="Last updated by">Last updated by</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="lastUpdatedLocation">
                      Last updated location
                    </Trans>
                  </th>
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

type ConditionRecordProps = {};
