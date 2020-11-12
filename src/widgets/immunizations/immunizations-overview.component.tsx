import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { DataTableSkeleton } from "carbon-components-react";
import { openWorkspaceTab } from "../shared-utils";

import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";

import useChartBasePath from "../../utils/use-chart-base";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { mapFromFHIRImmunizationBundle } from "./immunization-mapper";
import { ImmunizationsForm } from "./immunizations-form.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";

export default function ImmunizationsOverview(
  props: ImmunizationsOverviewProps
) {
  const [patientImmunizations, setPatientImmunizations] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const immunizationsPath = `${chartBasePath}/${props.basePath}`;
  const title = t("immunizations", "Immunizations");

  const headers = [
    {
      key: "vaccineName",
      header: t("vaccine", "Vaccine")
    },
    {
      key: "recentVaccination",
      header: t("recentVaccine", "Recent vaccination")
    }
  ];

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
    rows.map((row, index) => ({
      ...row,
      id: `${"immunization#"}${index + 1}`, // TODO: Redo in non-hacky way
      vaccine: row.vaccineName,
      occurenceDateTime: dayjs(row.existingDoses[0].occurenceDateTime).format(
        "MMM-YYYY"
      )
    }));

  const RenderImmunizations = () => {
    if (patientImmunizations.length) {
      const rows = getRowItems(patientImmunizations);
      return (
        <WidgetDataTable
          title={title}
          headers={headers}
          rows={rows}
          linkTo={immunizationsPath}
          addComponent={ImmunizationsForm}
          showComponent={() =>
            openWorkspaceTab(
              ImmunizationsForm,
              `${t("immunizationsForm", "Immunizations form")}`
            )
          }
        />
      );
    }
    return (
      <EmptyState
        displayText={t("immunizations", "immunizations")}
        name={t("immunizations", "Immunizations")}
        showComponent={() =>
          openWorkspaceTab(
            ImmunizationsForm,
            `${t("immunizationsForm", "Immunizations form")}`
          )
        }
        addComponent={ImmunizationsForm}
      />
    );
  };

  const RenderEmptyState = () => {
    if (hasError) {
      return (
        <EmptyState
          hasError={hasError}
          displayText={t("immunizations", "immunizations")}
          name={t("immunizations", "Immunizations")}
          showComponent={() =>
            openWorkspaceTab(
              ImmunizationsForm,
              `${t("immunizationsForm", "Immunizations form")}`
            )
          }
          addComponent={ImmunizationsForm}
        />
      );
    }
    return <DataTableSkeleton />;
  };

  return (
    <>{patientImmunizations ? <RenderImmunizations /> : <RenderEmptyState />}</>
  );
}

type ImmunizationsOverviewProps = {
  basePath: string;
};
