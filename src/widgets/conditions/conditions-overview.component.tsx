import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import { ConditionsForm } from "./conditions-form.component";
import { performPatientConditionsSearch } from "./conditions.resource";

export default function ConditionsOverview(props: ConditionsOverviewProps) {
  const [patientConditions, setPatientConditions] = useState(null);
  const [, patient] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const conditionsPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  useEffect(() => {
    if (patient) {
      const abortController = new AbortController();
      performPatientConditionsSearch(
        patient.identifier[0].value,
        abortController
      )
        .then(conditions => setPatientConditions(conditions))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patient]);

  return (
    <>
      {patientConditions?.entry?.length > 0 ? (
        <SummaryCard
          name={t("conditions_upper", "Conditions")}
          styles={{ margin: "1.25rem, 1.5rem" }}
          link={conditionsPath}
          addComponent={ConditionsForm}
          showComponent={() =>
            openWorkspaceTab(
              ConditionsForm,
              `${t("conditionsForm", "Conditions Form")}`
            )
          }
        >
          <SummaryCardRow>
            <SummaryCardRowContent>
              <HorizontalLabelValue
                label={t("activeConditions", "Active Conditions")}
                labelStyles={{
                  color: "var(--omrs-color-ink-medium-contrast)",
                  fontFamily: "Work Sans"
                }}
                value={t("since", "Since")}
                valueStyles={{
                  color: "var(--omrs-color-ink-medium-contrast)",
                  fontFamily: "Work Sans"
                }}
              />
            </SummaryCardRowContent>
          </SummaryCardRow>
          {patientConditions?.entry?.map(condition => {
            return (
              <SummaryCardRow
                key={condition?.resource?.id}
                linkTo={`${conditionsPath}/${condition?.resource?.id}`}
              >
                <HorizontalLabelValue
                  label={condition?.resource?.code?.text}
                  labelStyles={{ fontWeight: 500 }}
                  value={dayjs(condition?.resource?.onsetDateTime).format(
                    "MMM-YYYY"
                  )}
                  valueStyles={{ fontFamily: "Work Sans" }}
                />
              </SummaryCardRow>
            );
          })}
          <SummaryCardFooter linkTo={`${conditionsPath}`} />
        </SummaryCard>
      ) : (
        <EmptyState
          name={t("conditions_upper", "Conditions")}
          showComponent={() =>
            openWorkspaceTab(
              ConditionsForm,
              `${t("conditionsForm", "Conditions Form")}`
            )
          }
          addComponent={ConditionsForm}
          displayText={t("conditions_lower", "conditions")}
        />
      )}
    </>
  );
}

type ConditionsOverviewProps = {
  basePath: string;
};
