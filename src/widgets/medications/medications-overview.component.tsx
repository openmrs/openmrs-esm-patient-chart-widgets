import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { fetchPatientMedications } from "./medications.resource";
import styles from "./medications-overview.css";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useTranslation } from "react-i18next";
import { getDosage } from "./medication-orders-utils";
import { Link, useRouteMatch } from "react-router-dom";
import MedicationOrderBasket from "./medication-order-basket.component";
import { MedicationButton } from "./medication-button.component";

export default function MedicationsOverview(props: MedicationsOverviewProps) {
  const [patientMedications, setPatientMedications] = React.useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  const { t } = useTranslation();

  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const medicationsPath = chartBasePath + "/" + props.basePath;
  React.useEffect(() => {
    if (patientUuid) {
      const subscription = fetchPatientMedications(patientUuid).subscribe(
        medications => {
          const inactiveStates = ["REVISE", "DISCONTINUE"];
          setPatientMedications(
            medications.filter(
              (med: any) => !inactiveStates.includes(med.action)
            )
          );
        },
        createErrorHandler()
      );
      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  return (
    <SummaryCard
      name={t("Active Medications", "Active Medications")}
      styles={{ width: "100%" }}
      link={`${props.basePath}`}
    >
      <SummaryCardRow>
        <SummaryCardRowContent>
          <HorizontalLabelValue
            label="Active Medications"
            labelStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
            value=" "
            valueStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
          />
        </SummaryCardRowContent>
      </SummaryCardRow>
      <table className={styles.medicationsTable}>
        <tbody>{patientMedications && parseRestWsMeds()}</tbody>
      </table>
      <SummaryCardFooter linkTo={`${medicationsPath}`} />
    </SummaryCard>
  );

  function parseFhirMeds() {
    patientMedications.map((medication, index) => {
      return (
        <React.Fragment key={medication.id}>
          {medication.status === "active" && (
            <tr>
              <td>
                <span
                  style={{
                    fontWeight: 500,
                    color: "var(--omrs-color-ink-high-contrast)"
                  }}
                >
                  {medication.medicationReference.display}
                </span>
                {" \u2014 "} {medication.dosageInstruction[0].route.text}{" "}
                {" \u2014 "}
                {medication.dosageInstruction[0].doseQuantity.unit} {" \u2014 "}
                DOSE{" "}
                <span
                  style={{
                    fontWeight: 500,
                    color: "var(--omrs-color-ink-high-contrast)"
                  }}
                >
                  {medication.dosageInstruction[0].doseQuantity.value}{" "}
                  {medication.dosageInstruction[0].doseQuantity.unit}{" "}
                  {medication.dosageInstruction[0].timing.code.text}
                </span>
              </td>
              <td style={{ textAlign: "end" }}>
                <Link to={`${medicationsPath}/${medication.uuid}`}>
                  <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                    <use xlinkHref="#omrs-icon-chevron-right" />
                  </svg>
                </Link>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  }

  function parseRestWsMeds() {
    return patientMedications.map((medication, index) => {
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
                {medication.drug.name}
              </span>{" "}
              &mdash;{" "}
              <span style={{ color: "var(--omrs-color-ink-medium-contrast)" }}>
                {" "}
                DOSE
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
                ).toLowerCase()}
              </span>{" "}
              &mdash;
              <span>
                {" "}
                {(medication?.doseUnits?.display).toLowerCase()}
              </span>{" "}
              &mdash; <span>{(medication?.route?.display).toLowerCase()}</span>{" "}
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--omrs-color-ink-high-contrast)"
                }}
              >
                &mdash; {medication.frequency.display}
              </span>
            </td>
            <td>
              <MedicationButton
                component={MedicationOrderBasket}
                name={"Medication Order Basket"}
                label={"Revise"}
                orderUuid={medication.uuid}
                drugName={medication.drug.name}
                action={"REVISE"}
                inProgress={true}
                btnClass="omrs-btn omrs-text-action"
              />
              <MedicationButton
                component={MedicationOrderBasket}
                name={"Medication Order Basket"}
                label={"Discontinue"}
                orderUuid={medication.uuid}
                drugName={null}
                action={"DISCONTINUE"}
                inProgress={true}
                btnClass="omrs-btn omrs-text-destructive"
              />
            </td>
            <td style={{ textAlign: "end" }}>
              <Link to={`${medicationsPath}/${medication.uuid}`}>
                <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                  <use xlinkHref="#omrs-icon-chevron-right" />
                </svg>
              </Link>
            </td>
          </tr>
        </React.Fragment>
      );
    });
  }
}

type MedicationsOverviewProps = {
  basePath: string;
};
