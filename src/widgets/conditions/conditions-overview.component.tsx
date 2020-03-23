import React from "react";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import { performPatientConditionsSearch } from "./conditions.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

export default function ConditionsOverview(props: ConditionsOverviewProps) {
  const [patientConditions, setPatientConditions] = React.useState(null);
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
  const conditionsPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    if (patient) {
      const abortController = new AbortController();
      performPatientConditionsSearch(
        patient.identifier[0].value,
        abortController
      )
        .then(condition => setPatientConditions(condition))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patient]);

  return (
    <SummaryCard
      name={t("conditions", "Conditions")}
      styles={{ margin: "1.25rem, 1.5rem" }}
      link={conditionsPath}
    >
      <SummaryCardRow>
        <SummaryCardRowContent>
          <HorizontalLabelValue
            label="Active Conditions"
            labelStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
            value="Since"
            valueStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
          />
        </SummaryCardRowContent>
      </SummaryCardRow>
      {patientConditions &&
        patientConditions.entry.map(condition => {
          return (
            <SummaryCardRow
              key={condition.resource.id}
              linkTo={`${conditionsPath}/${condition.uuid}`}
            >
              <HorizontalLabelValue
                label={condition.resource.code.text}
                labelStyles={{ fontWeight: 500 }}
                value={dayjs(condition.resource.onsetDateTime).format(
                  "MMM-YYYY"
                )}
                valueStyles={{ fontFamily: "Work Sans" }}
              />
            </SummaryCardRow>
          );
        })}
      <SummaryCardFooter linkTo={`${conditionsPath}`} />
    </SummaryCard>
  );
}

type ConditionsOverviewProps = {
  basePath: string;
};
