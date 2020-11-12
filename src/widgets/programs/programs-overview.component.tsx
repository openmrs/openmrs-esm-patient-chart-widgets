import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { DataTableSkeleton } from "carbon-components-react";

import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import ProgramsForm from "./programs-form.component";
import { fetchActiveEnrollments } from "./programs.resource";
import useChartBasePath from "../../utils/use-chart-base";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import { PatientProgram } from "../types";
import { openWorkspaceTab } from "../shared-utils";

export default function ProgramsOverview(props: ProgramsOverviewProps) {
  const initialProgramsCount = 5;
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const [, , patientUuid] = useCurrentPatient();
  const [activePrograms, setActivePrograms] = useState<PatientProgram[]>(null);
  const [hasError, setHasError] = useState(false);
  const programsPath = chartBasePath + "/" + props.basePath;
  const title = t("carePrograms", "Care programs"); // TODO: Update translation keys to sentence case per carbon guidelines

  const headers = [
    {
      key: "display",
      header: t("activePrograms", "Active programs")
    },
    {
      key: "dateEnrolled",
      header: t("since", "Since")
    }
  ];

  useEffect(() => {
    if (patientUuid) {
      const subscription = fetchActiveEnrollments(patientUuid).subscribe(
        programs => {
          setActivePrograms(programs.slice(0, initialProgramsCount));
        },
        err => {
          setHasError(true);
          createErrorHandler();
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      id: row.uuid,
      display: row.display,
      dateEnrolled: dayjs(row.dateEnrolled).format("MMM-YYYY")
    }));

  const RenderPrograms = () => {
    if (activePrograms.length) {
      const rows = getRowItems(activePrograms);
      return (
        <WidgetDataTable
          title={title}
          headers={headers}
          rows={rows}
          linkTo={programsPath}
          showComponent={() =>
            openWorkspaceTab(
              ProgramsForm,
              `${t("programsForm", "Programs Form")}`
            )
          }
          addComponent={ProgramsForm}
        />
      );
    }
    return (
      <EmptyState
        displayText={t("programEnrollments", "program enrollments")}
        name={t("carePrograms", "Care programs")}
        showComponent={() =>
          openWorkspaceTab(
            ProgramsForm,
            `${t("programsForm", "Programs Form")}`
          )
        }
        addComponent={ProgramsForm}
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

  return <>{activePrograms ? <RenderPrograms /> : <RenderEmptyState />}</>;
}

type ProgramsOverviewProps = {
  basePath: string;
};
