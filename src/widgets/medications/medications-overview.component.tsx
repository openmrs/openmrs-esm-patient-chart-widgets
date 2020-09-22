import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { fetchPatientMedications } from "./medications.resource";
import styles from "./medications-overview.css";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useTranslation } from "react-i18next";
import { getDosage } from "./medication-orders-utils";
import { Link } from "react-router-dom";
import MedicationOrderBasket from "./medication-order-basket.component";
import { MedicationButton } from "./medication-button.component";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";

export default function MedicationsOverview({
  basePath
}: MedicationsOverviewProps) {
  const [patientMedications, setPatientMedications] = React.useState(null);
  const [, , patientUuid] = useCurrentPatient();

  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const medicationsPath = chartBasePath + "/" + basePath;
  React.useEffect(() => {
    if (patientUuid) {
      const subscription = fetchPatientMedications(patientUuid).subscribe(
        medications => {
          setPatientMedications(medications);
        },
        createErrorHandler()
      );
      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  return (
    <>
      {patientMedications?.length > 0 ? (
        <SummaryCard
          name={t("activeMedications", "Active Medications")}
          styles={{ width: "100%" }}
          link={`${basePath}`}
          showComponent={() =>
            openWorkspaceTab(
              MedicationOrderBasket,
              `${t("medicationOrder", "Medication Order")}`
            )
          }
        >
          <SummaryCardRow>
            <SummaryCardRowContent>
              <HorizontalLabelValue
                label={t("activeMedications", "Active Medications")}
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
            <tbody>
              {patientMedications.map((medication, index) => (
                <tr key={index}>
                  <td>
                    <span
                      style={{
                        fontWeight: 500,
                        color: "var(--omrs-color-ink-high-contrast)"
                      }}
                    >
                      {medication?.drug?.name}
                    </span>{" "}
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
                      {medication?.doseUnits?.display.toLowerCase()}
                    </span>{" "}
                    &mdash;{" "}
                    <span>{medication?.route?.display.toLowerCase()}</span>{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "var(--omrs-color-ink-high-contrast)"
                      }}
                    >
                      &mdash; {medication?.frequency?.display}
                    </span>
                  </td>
                  <td>
                    <MedicationButton
                      component={MedicationOrderBasket}
                      name={"Medication Order Basket"}
                      label={t("revise", "Revise")}
                      orderUuid={medication?.uuid}
                      drugName={medication?.drug?.name}
                      action={"REVISE"}
                      inProgress={true}
                      btnClass="omrs-btn omrs-text-action"
                    />
                    <MedicationButton
                      component={MedicationOrderBasket}
                      name={"Medication Order Basket"}
                      label={t("discontinue", "Discontinue")}
                      orderUuid={medication?.uuid}
                      drugName={null}
                      action={"DISCONTINUE"}
                      inProgress={true}
                      btnClass="omrs-btn omrs-text-destructive"
                    />
                  </td>
                  <td style={{ textAlign: "end" }}>
                    <Link to={`${medicationsPath}/${medication?.uuid}`}>
                      <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                        <use xlinkHref="#omrs-icon-chevron-right" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <SummaryCardFooter linkTo={medicationsPath} />
        </SummaryCard>
      ) : (
        <EmptyState
          name={t("activeMedications", "Active Medications")}
          showComponent={() =>
            openWorkspaceTab(
              MedicationOrderBasket,
              `${t("medicationOrder", "Medication Order")}`
            )
          }
          addComponent={MedicationOrderBasket}
          displayText={t("activeMedications", "active medications")}
        />
      )}
    </>
  );
}

type MedicationsOverviewProps = {
  basePath: string;
};
