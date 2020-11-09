import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import { DataTableSkeleton } from "carbon-components-react";
import ProgramsForm from "./programs-form.component";
import { fetchActiveEnrollments } from "./programs.resource";
import useChartBasePath from "../../utils/use-chart-base";
import EmptyState from "../../ui-components/empty-state/empty-state2.component";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import { PatientProgram } from "../types";
import { openWorkspaceTab } from "../shared-utils";

export default function ProgramsOverview(props: ProgramsOverviewProps) {
  const initialProgramsCount = 5;
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const [, , patientUuid] = useCurrentPatient();
  const [activePrograms, setActivePrograms] = useState(Array<PatientProgram>());
  const programsPath = chartBasePath + "/" + props.basePath;
  const title = `${t("carePrograms", "Care programs")}`; // TODO: Update translation keys to sentence case per carbon guidelines

  const headers = [
    {
      key: "display",
      header: `${t("activePrograms", "Active programs")}`
    },
    {
      key: "dateEnrolled",
      header: `${t("since", "Since")}`
    }
  ];

  useEffect(() => {
    if (patientUuid) {
      const subscription = fetchActiveEnrollments(patientUuid).subscribe(
        programs => setActivePrograms(programs.slice(0, initialProgramsCount)),
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      dateEnrolled: dayjs(row.onsetDateTime).format("MMM-YYYY")
    }));

  const RenderPrograms = () => {
    if (activePrograms.length) {
      const rows = getRowItems(activePrograms);
      return <WidgetDataTable title={title} headers={headers} rows={rows} />;
    }
    return (
      <EmptyState
        name={t("carePrograms", "Care programs")}
        displayText={t("programEnrollments", "program enrollments")}
      />
    );
  };

  return <>{activePrograms ? <RenderPrograms /> : <DataTableSkeleton />}</>;
}

type ProgramsOverviewProps = {
  basePath: string;
};
