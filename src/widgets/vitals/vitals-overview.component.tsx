import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { DataTableSkeleton } from "carbon-components-react";

import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import { openWorkspaceTab } from "../shared-utils";
import { ConfigObject } from "../../config-schema";
import withConfig from "../../with-config";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import useChartBasePath from "../../utils/use-chart-base";
import { formatDate } from "../heightandweight/heightandweight-helper";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import VitalsForm from "./vitals-form.component";
import styles from "./vitals-overview.css";

function VitalsOverview(props: VitalsOverviewProps) {
  const initialVitalsCount = 5;
  const { t } = useTranslation();
  const {
    bloodPressureUnit,
    oxygenSaturationUnit,
    pulseUnit,
    temperatureUnit
  } = props.config.vitals;
  const [patientVitals, setPatientVitals] = useState<any[]>(null);
  const [hasError, setHasError] = useState(false);
  const [, , patientUuid] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const vitalsPath = chartBasePath + "/" + props.basePath;
  const title = t("vitals", "Vitals");

  const headers = [
    {
      key: "date",
      header: "Date"
    },
    {
      key: "bloodPressure",
      header: `${t("bp", "BP")} (${bloodPressureUnit})`
    },
    {
      key: "pulse",
      header: `${t("rate", "Rate")} (${pulseUnit})`
    },
    {
      key: "oxygenSaturation",
      header: `${t("oxygen", "Oxygen")} (${oxygenSaturationUnit})`
    },
    {
      key: "temperature",
      header: `${t("temp", "Temp")} (${temperatureUnit})`
    }
  ];

  useEffect(() => {
    if (patientUuid) {
      const sub = performPatientsVitalsSearch(
        props.config.concepts,
        patientUuid
      ).subscribe(
        vitals => {
          setPatientVitals(vitals.slice(0, initialVitalsCount));
        },
        err => {
          setHasError(true);
          createErrorHandler();
        }
      );

      return () => sub.unsubscribe();
    }
  }, [patientUuid, props.config]);

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      date: formatDate(row.date),
      bloodPressure: `${row?.systolic || "-"} / ${row?.diastolic || "-"}`,
      pulse: row.pulse ? row.pulse : "",
      oxygenSaturation: row.oxygenSaturation ? row.oxygenSaturation : "",
      temperature: row.temperature ? row.temperature : ""
    }));

  const RenderVitals = () => {
    if (patientVitals.length) {
      const rows = getRowItems(patientVitals);
      return (
        <WidgetDataTable
          title={title}
          headers={headers}
          rows={rows}
          linkTo={vitalsPath}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals form")}`)
          }
          addComponent={VitalsForm}
        />
      );
    }
    return (
      <EmptyState
        displayText={t("vitalSigns", "vital signs")}
        name={t("vitals", "Vitals")}
        showComponent={() =>
          openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals form")}`)
        }
        addComponent={VitalsForm}
      />
    );
  };

  const RenderEmptyState = () => {
    if (hasError) {
      return (
        <EmptyState
          hasError={hasError}
          displayText={t("vitalSigns", "vital signs")}
          name={t("vitals", "Vitals")}
        />
      );
    }
    return <DataTableSkeleton />;
  };

  return <>{patientVitals ? <RenderVitals /> : <RenderEmptyState />}</>;
}

type VitalsOverviewProps = {
  basePath: string;
  config?: ConfigObject;
};

export default withConfig(VitalsOverview);
