import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { useTranslation } from "react-i18next";
import { DataTableSkeleton } from "carbon-components-react";

import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import useChartBasePath from "../../utils/use-chart-base";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { getAppointments } from "./appointments.resource";
import AppointmentsForm from "./appointments-form.component";
import styles from "./appointments-overview.css";
import { openWorkspaceTab } from "../shared-utils";

export default function AppointmentsOverview(props: AppointmentOverviewProps) {
  const initialAppointmentsCount = 5;
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const [, , patientUuid] = useCurrentPatient();
  const [patientAppointments, setPatientAppointments] = useState(null);
  const [hasError, setHasError] = useState(false);
  const appointmentsPath = chartBasePath + "/" + props.basePath;
  const startDate = dayjs().format();
  const title = t("appointments", "Appointments");

  const headers = [
    {
      key: "name",
      header: t("name", "Name")
    },
    {
      key: "startDateTime",
      header: t("startDateTime", "Start at") // TODO: Update translation keys
    },
    {
      key: "status",
      header: t("status", "Status")
    }
  ];

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();

      getAppointments(patientUuid, startDate, abortController)
        .then(({ data }) => {
          setPatientAppointments(data);
        })
        .catch(err => {
          setHasError(true);
          createErrorHandler();
        });

      return () => abortController.abort();
    }
  }, [patientUuid, startDate]);

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      name: row.service?.name,
      startDateTime: dayjs(row.startDateTime).format("MMM-YYYY"),
      status: row.status
    }));

  const RenderAppointments = () => {
    if (patientAppointments.length) {
      const rows = getRowItems(patientAppointments);
      return (
        <WidgetDataTable
          title={title}
          headers={headers}
          rows={rows}
          linkTo={appointmentsPath}
        />
      );
    }
    return (
      <EmptyState
        displayText={t("appointments", "appointments")}
        name={t("appointments", "Appointments")}
        showComponent={() =>
          openWorkspaceTab(
            AppointmentsForm,
            `${t("appointmentsForm", "Appointments Form")}`
          )
        }
        addComponent={AppointmentsForm}
      />
    );
  };

  const RenderEmptyState = () => {
    if (hasError) {
      return (
        <EmptyState
          hasError={hasError}
          displayText={t("appointments", "appointments")}
          name={t("appointments", "Appointments")}
        />
      );
    }
    return <DataTableSkeleton />;
  };

  return (
    <>{patientAppointments ? <RenderAppointments /> : <RenderEmptyState />}</>
  );
}

type AppointmentOverviewProps = {
  basePath: string;
};
