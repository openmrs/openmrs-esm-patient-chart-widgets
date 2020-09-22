import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
import { openWorkspaceTab } from "../shared-utils";
import { getMedicationByUuid } from "./medications.resource";
import MedicationOrderBasket from "./medication-order-basket.component";
import { formatDuration, getDosage } from "./medication-orders-utils";
import styles from "./medication-record.css";

type TParams = {
  medicationUuid: string;
};

export default function MedicationRecord(props: MedicationRecordProps) {
  const [patientMedication, setPatientMedication] = React.useState(null);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const match: match<TParams> = useRouteMatch();
  const { params } = match;
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!isLoadingPatient && patient) {
      const abortController = new AbortController();
      getMedicationByUuid(abortController, params["medicationUuid"]).then(
        response => setPatientMedication(response.data),
        createErrorHandler()
      );
      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient, params]);

  return (
    <>
      {!!(patientMedication && Object.entries(patientMedication)) && (
        <div className={styles.medicationContainer}>
          <SummaryCard
            name={t("medication", "Medication")}
            styles={{ width: "100%" }}
            editComponent={MedicationOrderBasket}
            showComponent={() =>
              openWorkspaceTab(
                MedicationOrderBasket,
                `${t("editMedicationOrder", "Edit Medication Order")}`,
                {
                  drugName: patientMedication?.drug?.display,
                  orderUuid: patientMedication?.uuid,
                  action: `${t("revise", "REVISE")}`
                }
              )
            }
          >
            <div className={`omrs-type-body-regular ${styles.medicationCard}`}>
              <p
                className="omrs-type-title-3"
                style={{ color: "var(--omrs-color-ink-medium-contrast)" }}
              >
                {patientMedication?.drug?.display}
              </p>
              <div className={styles.medicationSummaryLine}>
                <span
                  className="omrs-medium"
                  style={{
                    color: "var(--omrs-color-ink-high-contrast)"
                  }}
                >
                  {patientMedication?.drug?.display}
                </span>{" "}
                &mdash;{" "}
                <span>
                  {" "}
                  {(patientMedication?.doseUnits?.display).toLowerCase()}
                </span>{" "}
                &mdash;{" "}
                <span>{(patientMedication?.route?.display).toLowerCase()}</span>{" "}
                &mdash;{" "}
                <span
                  style={{
                    color: "var(--omrs-color-ink-medium-contrast)",
                    textTransform: "uppercase"
                  }}
                >
                  {" "}
                  {t("dose", "DOSE")}
                </span>{" "}
                <span className="omrs-medium">
                  {getDosage(
                    patientMedication?.drug?.strength,
                    patientMedication?.dose
                  ).toLowerCase()}
                </span>{" "}
                &mdash; <span>{patientMedication?.frequency?.display}</span>
              </div>
              <table className={styles.medicationTable}>
                <tbody>
                  <tr>
                    <th>{t("startDate", "Start date")}</th>
                    <th>
                      {t("substitutionsPermitted", "Substitutions permitted")}
                    </th>
                  </tr>
                  <tr>
                    <td style={{ letterSpacing: "0.028rem" }}>
                      {patientMedication.dateActivated
                        ? dayjs(patientMedication?.dateActivated).format(
                            "dddd DD-MMM-YYYY"
                          )
                        : "—"}
                    </td>
                    <td>&mdash;</td>
                  </tr>
                  <tr>
                    <th>{t("endDate", "End date")}</th>
                    <th>{t("dosingInstructions", "Dosing instructions")}</th>
                  </tr>
                  <tr>
                    <td>
                      {patientMedication?.dateStopped
                        ? dayjs(patientMedication?.dateStopped).format(
                            "dddd DD-MMM-YYYY"
                          )
                        : "—"}
                    </td>
                    <td>
                      {patientMedication?.dosingInstructions
                        ? patientMedication.dosingInstructions
                        : "none"}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("duration", "Duration")}</th>
                  </tr>
                  <tr>
                    <td>{formatDuration(patientMedication)}</td>
                  </tr>
                  <tr>
                    <th>{t("totalRefills", "Total number of refills")}</th>
                  </tr>
                  <tr>
                    <td>{patientMedication?.numRefills}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SummaryCard>
          <RecordDetails>
            <div className={styles.medicationCard}>
              <table className={styles.medicationDetailsTable}>
                <thead>
                  <tr>
                    <th>{t("lastUpdated", "Last updated")}</th>
                    <th>{t("lastUpdatedBy", "Last updated by")}</th>
                    <th>{t("lastUpdatedLocation", "Last updated location")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: "Work Sans" }}>
                      {dayjs(patientMedication?.dateActivated).format(
                        "DD-MMM-YYYY"
                      )}
                    </td>
                    <td>{patientMedication?.orderer?.person?.display}</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </RecordDetails>
        </div>
      )}
    </>
  );
}

type MedicationRecordProps = {};
