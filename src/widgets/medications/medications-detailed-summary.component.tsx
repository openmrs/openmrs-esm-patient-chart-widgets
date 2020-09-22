import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./medications-detailed-summary.css";
import dayjs from "dayjs";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useTranslation } from "react-i18next";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import {
  fetchPatientMedications,
  fetchPatientPastMedications,
  PatientMedications
} from "./medications.resource";
import { formatDuration, getDosage } from "./medication-orders-utils";
import { MedicationButton } from "./medication-button.component";
import MedicationOrderBasket from "./medication-order-basket.component";
import { openWorkspaceTab } from "../shared-utils";
import { isEmpty } from "lodash-es";
import { toOmrsDateString } from "../../utils/omrs-dates";

export default function MedicationsDetailedSummary(
  props: MedicationsDetailedSummaryProps
) {
  const [currentMedications, setCurrentMedications] = React.useState(null);
  const [pastMedications, setPastMedications] = React.useState(null);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();
  const match = useRouteMatch();

  React.useEffect(() => {
    if (patientUuid) {
      const fetchMedicationsSub = fetchPatientMedications(
        patientUuid
      ).subscribe(medications => {
        setCurrentMedications(medications);
      }, createErrorHandler());
      const fetchPastMedicationsSub = fetchPatientPastMedications(
        patientUuid,
        "any"
      ).subscribe(medications => {
        setPastMedications(
          medications
            .sort((a: PatientMedications, b: PatientMedications) => {
              return (
                new Date(b.dateActivated).getDate() -
                new Date(a.dateActivated).getDate()
              );
            })
            .filter((med: PatientMedications) => {
              return (
                toOmrsDateString(new Date()) >=
                  toOmrsDateString(med.autoExpireDate) ||
                !isEmpty(med.dateStopped)
              );
            })
        );
      });
      return () => {
        fetchMedicationsSub.unsubscribe();
        fetchPastMedicationsSub.unsubscribe();
      };
    }
  }, [patientUuid]);

  function displayCurrentMedications() {
    return (
      <React.Fragment>
        <SummaryCard
          name={t("medicationsCurrent", "Medications - current")}
          addComponent={MedicationOrderBasket}
          showComponent={() =>
            openWorkspaceTab(
              MedicationOrderBasket,
              `${t("medicationOrder", "Medication Order")}`,
              {
                action: "NEW"
              }
            )
          }
        >
          <table className={styles.medicationsTable}>
            <thead>
              <tr style={{ textTransform: "uppercase" }}>
                <td>{t("name", "NAME")}</td>
                <td className={styles.centerItems}>{t("status", "STATUS")}</td>
                <td className={styles.dateLabel}>
                  {t("startDate", "START DATE")}
                </td>
                <td>{t("actions", "ACTIONS")}</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {currentMedications &&
                currentMedications.map(medication => {
                  return (
                    <React.Fragment key={medication.uuid}>
                      <tr>
                        <td>
                          <span
                            style={{
                              fontWeight: 500,
                              color: "var(--omrs-color-ink-high-contrast)"
                            }}
                          >
                            {medication?.drug?.name}
                          </span>{" "}
                          &mdash; {(medication?.route?.display).toLowerCase()}{" "}
                          &mdash; {medication?.doseUnits?.display.toLowerCase()}{" "}
                          &mdash;{" "}
                          <span
                            style={{
                              color: "var(--omrs-color-ink-medium-contrast)",
                              textTransform: "uppercase"
                            }}
                          >
                            {t("dose", "DOSE")}
                          </span>{" "}
                          <span
                            style={{
                              fontWeight: 500,
                              color: "var(--omrs-color-ink-high-contrast)"
                            }}
                          >
                            {getDosage(
                              medication?.drug?.strength,
                              medication?.dose
                            )}
                          </span>
                          <span>
                            {" "}
                            &mdash; {
                              medication?.frequency?.display
                            } &mdash; {formatDuration(medication)} &mdash;
                          </span>{" "}
                          <span
                            style={{
                              color: "var(--omrs-color-ink-medium-contrast)",
                              textTransform: "uppercase"
                            }}
                          >
                            {t("refills", "REFILLS")}
                          </span>{" "}
                          <span>{medication.numRefills}</span>{" "}
                        </td>
                        <td>{medication.action}</td>
                        <td
                          className="omrs-type-body-regular"
                          style={{ fontFamily: "Work Sans" }}
                        >
                          {dayjs(medication.dateActivated).format(
                            "DD-MMM-YYYY"
                          )}
                        </td>
                        <td>
                          <MedicationButton
                            component={MedicationOrderBasket}
                            name={"Medication Order Basket"}
                            label={t("revise", "Revise")}
                            orderUuid={medication.uuid}
                            drugName={medication.drug.name}
                            action={"REVISE"}
                            inProgress={true}
                            btnClass="omrs-btn omrs-text-action"
                          />
                          <MedicationButton
                            component={MedicationOrderBasket}
                            name={"Medication Order Basket"}
                            label={t("discontinue", "Discontinue")}
                            orderUuid={medication.uuid}
                            drugName={null}
                            action={"DISCONTINUE"}
                            inProgress={true}
                            btnClass="omrs-btn omrs-text-destructive"
                          />
                        </td>
                        <td style={{ textAlign: "end" }}>
                          <Link to={`${match.path}/${medication.uuid}`}>
                            <svg
                              className="omrs-icon"
                              fill="rgba(60, 60, 67, 0.3)"
                            >
                              <use xlinkHref="#omrs-icon-chevron-right" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </SummaryCard>
      </React.Fragment>
    );
  }

  function displayPastMedications() {
    return (
      <>
        <React.Fragment>
          <SummaryCard
            name={t("medicationsPast", "Medications - past")}
            addComponent={MedicationOrderBasket}
            showComponent={() =>
              openWorkspaceTab(
                MedicationOrderBasket,
                `${t("medicationOrder", "Medication Order")}`,
                {
                  action: "NEW"
                }
              )
            }
          >
            <table className={styles.medicationsTable}>
              <thead>
                <tr style={{ textTransform: "uppercase" }}>
                  <td>{t("status", "Status")}</td>
                  <td>{t("name", "Name")}</td>
                  <td className={styles.dateLabel}>
                    {t("endDate", "End Date")}
                  </td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {pastMedications &&
                  pastMedications.map(medication => {
                    return (
                      <React.Fragment key={medication.uuid}>
                        <tr>
                          <td className={styles.pastMedStatus}>
                            {medication.action}
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: 500,
                                color: "var(--omrs-color-ink-high-contrast)"
                              }}
                            >
                              {medication?.drug?.name}
                            </span>{" "}
                            &mdash; {medication?.doseUnits?.display} &mdash;{" "}
                            {(medication?.route?.display).toLowerCase()} &mdash;{" "}
                            <span
                              style={{
                                color: "var(--omrs-color-ink-medium-contrast)",
                                textTransform: "uppercase"
                              }}
                            >
                              {t("dose", "Dose")}
                            </span>{" "}
                            <span
                              style={{
                                fontWeight: 500,
                                color: "var(--omrs-color-ink-high-contrast)"
                              }}
                            >
                              {getDosage(
                                medication?.drug?.strength,
                                medication?.dose
                              )}
                            </span>
                            <span>
                              {" "}
                              &mdash; {
                                medication?.frequency?.display
                              } &mdash; {formatDuration(medication)}
                            </span>{" "}
                            <span
                              style={{
                                color: "var(--omrs-color-ink-medium-contrast)",
                                textTransform: "uppercase"
                              }}
                            >
                              {t("refills", "Refills")}
                            </span>{" "}
                            <span>{medication.numRefills}</span>
                          </td>
                          <td
                            className="omrs-type-body-regular"
                            style={{ fontFamily: "Work Sans" }}
                          >
                            {dayjs(
                              medication.dateStopped
                                ? medication.dateStopped
                                : medication.autoExpireDate
                            ).format("DD-MMM-YYYY")}
                          </td>
                          <td style={{ textAlign: "end" }}>
                            <Link to={`${match.path}/${medication.uuid}`}>
                              <svg
                                className="omrs-icon"
                                fill="rgba(60, 60, 67, 0.3)"
                              >
                                <use xlinkHref="#omrs-icon-chevron-right" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </SummaryCard>
        </React.Fragment>
      </>
    );
  }

  function displayMedications() {
    return (
      <>
        <div>
          {currentMedications && currentMedications.length > 0 ? (
            displayCurrentMedications()
          ) : (
            <SummaryCard
              name={t("medicationsCurrent", "Medications - current")}
              styles={{ width: "100%" }}
              addComponent={MedicationOrderBasket}
              showComponent={() =>
                openWorkspaceTab(
                  MedicationOrderBasket,
                  `${t("medicationOrder", "Medication Order")}`,
                  {
                    action: "NEW"
                  }
                )
              }
            >
              <div className={styles.emptyMedications}>
                <p className="omrs-bold">
                  {t(
                    "noCurrentMedicationsDocumented",
                    "No current medications are documented."
                  )}
                </p>
              </div>
            </SummaryCard>
          )}
        </div>
        <div>
          {pastMedications && pastMedications.length > 0 ? (
            displayPastMedications()
          ) : (
            <SummaryCard
              name={t("medicationsPast", "Medications - past")}
              styles={{ width: "100%" }}
              addComponent={MedicationOrderBasket}
              showComponent={() =>
                openWorkspaceTab(
                  MedicationOrderBasket,
                  `${t("medicationOrder", "Medication Order")}`,
                  {
                    action: "NEW"
                  }
                )
              }
            >
              <div className={styles.emptyMedications}>
                <p className="omrs-bold">
                  {t(
                    "noPastMedicationsDocumented",
                    "No past medications are documented."
                  )}
                </p>
              </div>
            </SummaryCard>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {(currentMedications || pastMedications) && (
        <div className={styles.medicationsSummary}>
          {!isEmpty(currentMedications) || !isEmpty(pastMedications) ? (
            displayMedications()
          ) : (
            <EmptyState
              name={t("medications", "Medications")}
              showComponent={() =>
                openWorkspaceTab(
                  MedicationOrderBasket,
                  `${t("medicationOrder", "Medication Order")}`,
                  {
                    action: "NEW"
                  }
                )
              }
              addComponent={MedicationOrderBasket}
              displayText={t("medicationOrders", "medication orders")}
            />
          )}
        </div>
      )}
    </>
  );
}

type MedicationsDetailedSummaryProps = {};
