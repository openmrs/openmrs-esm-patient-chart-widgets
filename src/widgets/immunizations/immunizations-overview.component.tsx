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
import styles from "./immunizations-overview.css";
import { DataTable, DataTableSkeleton } from "carbon-components-react";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import EmptyState from "../../ui-components/empty-state/empty-state2.component";
import ErrorState from "../../ui-components/error-state/error-state.component";

const headers = [
  {
    key: "display",
    header: "Active Programs"
  },
  {
    key: "onsetDateTime",
    header: "Since"
  }
];

export default function ImmunizationsOverview(
  props: ImmunizationsOverviewProps
) {
  const [patientImmunizations, setPatientImmunizations] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const immunizationsPath = `${chartBasePath}/${props.basePath}`;
  const title = "Immunizations";

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

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      display: row.display,
      onsetDateTime: dayjs(row.onsetDateTime).format("MMM-YYYY")
    }));

  const RenderImmunizations = () => {
    if (patientImmunizations.length) {
      const rows = getRowItems(patientImmunizations);
      return <WidgetDataTable title={title} headers={headers} rows={rows} />;
    }
    return (
      <EmptyState
        displayText={t("immunizations", "immunizations")}
        name={t("immunizations", "Immunizations")}
      />
    );
  };

  const RenderErrorOrLoadingState = () => {
    if (hasError) {
      return (
        <EmptyState
          hasError={hasError}
          displayText={t("immunizations", "immunizations")}
          name={t("immunizations", "Immunizations")}
        />
      );
    }
    return <DataTableSkeleton />;
  };

  return (
    <>
      {patientImmunizations ? (
        <RenderImmunizations />
      ) : (
        <RenderErrorOrLoadingState />
      )}
    </>
  );
}

type ImmunizationsOverviewProps = {
  basePath: string;
};
