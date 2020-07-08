import React, { useEffect, useState } from "react";
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
import useChartBasePath from "../../utils/use-chart-base";
import { mapFromFHIRImmunizationBundle } from "./immunization-mapper";

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
  const immunizationsPath = `${chartBasePath}/${props.basePath}`;

  useEffect(() => {
    if (patient) {
      const abortController = new AbortController();
      performPatientImmunizationsSearch(
        patient.identifier[0].value,
        patientUuid,
        abortController
      )
        .then(searchResult => {
          let allImmunizations = mapFromFHIRImmunizationBundle(searchResult);
          setPatientImmunizations(allImmunizations);
        })
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patient, patientUuid]);

  return (
    <SummaryCard
      name={t("Immunizations", "Immunizations")}
      styles={{ margin: "1.25rem, 1.5rem" }}
      link={immunizationsPath}
    >
      <SummaryCardRow>
        <SummaryCardRowContent>
          <HorizontalLabelValue
            label={t("vaccine", "Vaccine")}
            labelStyles={{
              color: "var(--omrs-color-ink-medium-contrast)",
              fontFamily: "Work Sans"
            }}
            value={t("recent vaccination", "Recent vaccination")}
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
            <SummaryCardRow key={immunization.vaccineUuid}>
              <HorizontalLabelValue
                label={immunization.vaccineName}
                labelStyles={{ fontWeight: 500 }}
                value={dayjs(
                  immunization.existingDoses[0].occurrenceDateTime
                ).format("MMM-YYYY")}
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
