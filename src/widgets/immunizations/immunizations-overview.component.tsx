import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import { DataTableSkeleton } from "carbon-components-react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { useTranslation } from "react-i18next";
import useChartBasePath from "../../utils/use-chart-base";

import { mapFromFHIRImmunizationBundle } from "./immunization-mapper";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import styles from "./immunizations-overview.css";

export default function ImmunizationsOverview(
  props: ImmunizationsOverviewProps
) {
  const [patientImmunizations, setPatientImmunizations] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const immunizationsPath = `${chartBasePath}/${props.basePath}`;
  const displayText = t("immunizations", "immunizations");
  const headerTitle = t("immunizations", "Immunizations");

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
        .catch(err => {
          setHasError(true);
          createErrorHandler();
        });

      return () => abortController.abort();
    }
  }, [patient, patientUuid]);

  const RenderImmunizations = () => {
    if (patientImmunizations.length) {
      return (
        <SummaryCard
          name={t("immunizations", "Immunizations")}
          className={styles.immunizationOverviewSummaryCard}
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
                value={t("recentVaccination", "Recent Vaccination")}
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
          <SummaryCardFooter linkTo={immunizationsPath} />
        </SummaryCard>
      );
    }
    return <EmptyState displayText={displayText} headerTitle={headerTitle} />;
  };

  return (
    <>
      {patientImmunizations ? (
        <RenderImmunizations />
      ) : hasError ? (
        <ErrorState displayText={displayText} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={2} />
      )}
    </>
  );
}

type ImmunizationsOverviewProps = {
  basePath: string;
};
