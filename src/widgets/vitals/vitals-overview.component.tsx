import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { ConfigObject } from "../../config-schema";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import useChartBasePath from "../../utils/use-chart-base";
import { formatDate } from "../heightandweight/heightandweight-helper";
import { openWorkspaceTab } from "../shared-utils";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import VitalsForm from "./vitals-form.component";
import styles from "./vitals-overview.css";
import withConfig from "../../with-config";
import { DataTableSkeleton } from "carbon-components-react";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";

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
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
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
      header: `${t("rate", "Rate")} (${oxygenSaturationUnit})`
    },
    {
      key: "oxygenSaturation",
      header: `${t("oxygen", "Oxygen")} (${pulseUnit})`
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
      return <WidgetDataTable title={title} headers={headers} rows={rows} />;
    }
    return (
      <EmptyState
      displayText={t("programEnrollments", "program enrollments")}
      name={t("carePrograms", "Care programs")}
      />
    );
  };

  const RenderEmptyState = () => {
    if (hasError) {
      return (
        <EmptyState
          hasError={hasError}
          displayText={t("programEnrollments", "program enrollments")}
          name={t("carePrograms", "Care programs")}
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
