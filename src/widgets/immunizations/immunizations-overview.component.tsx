import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import { useTranslation } from "react-i18next";
import { ImmunizationsForm } from "./immunizations-form.component";
import { openWorkspaceTab } from "../shared-utils";
import { groupBy, map, mapValues, maxBy, values } from "lodash-es";
import useChartBasePath from "../../utils/use-chart-base";

export default function ImmunizationsOverview(
  props: ImmunizationsOverviewProps
) {
  const [patientImmunizations, setPatientImmunizations] = useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const immunizationsPath = chartBasePath + "/" + props.basePath;

  useEffect(() => {
    if (patient) {
      const abortController = new AbortController();
      performPatientImmunizationsSearch(
        patient.identifier[0].value,
        abortController
      )
        .then(allImmunizations => {
          let groupByImmunization = groupBy(
            allImmunizations.entry,
            "resource.vaccineCode.text"
          );
          let groupWithRecentDoses = mapValues(groupByImmunization, group =>
            maxBy(
              group,
              "resource.protocolApplied[0].protocol.occurrenceDateTime"
            )
          );
          let immunizationsWithRecentDoses = values(groupWithRecentDoses);
          setPatientImmunizations(immunizationsWithRecentDoses);
        })
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patient]);

  return (
    <SummaryCard
      name={t("immunizations", "Immunizations")}
      styles={{ margin: "1.25rem, 1.5rem" }}
      link={immunizationsPath}
    >
      <SummaryCardRow>
        <SummaryCardRowContent>
          <HorizontalLabelValue
            label="Vaccine"
            labelStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
            value="Recent vaccination"
            valueStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
          />
        </SummaryCardRowContent>
      </SummaryCardRow>
      {patientImmunizations &&
        patientImmunizations.map(immunization => {
          return (
            <SummaryCardRow key={immunization.resource.uuid}>
              <HorizontalLabelValue
                label={immunization.resource.vaccineCode.text}
                labelStyles={{ fontWeight: 500 }}
                value={dayjs(immunization.resource.occurrenceDateTime).format(
                  "MMM-YYYY"
                )}
                valueStyles={{ fontFamily: "Work Sans" }}
              />
            </SummaryCardRow>
          );
        })}
      <SummaryCardFooter linkTo={`${immunizationsPath}`} />
    </SummaryCard>
  );
}

type ImmunizationsOverviewProps = {
  basePath: string;
};
