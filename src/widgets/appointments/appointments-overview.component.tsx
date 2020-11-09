import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import useChartBasePath from "../../utils/use-chart-base";
import { openWorkspaceTab } from "../shared-utils";
import { getAppointments } from "./appointments.resource";
import EmptyState from "../../ui-components/empty-state/empty-state2.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import AppointmentsForm from "./appointments-form.component";
import styles from "./appointments-overview.css";
import { DataTableSkeleton } from "carbon-components-react";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";

export default function AppointmentsOverview(props: AppointmentOverviewProps) {
  const initialAppointmentsCount = 5;
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const [, , patientUuid] = useCurrentPatient();
  const [patientAppointments, setPatientAppointments] = useState([]);
  const appointmentsPath = chartBasePath + "/" + props.basePath;
  const startDate = dayjs().format();
  const title = `${t("appointments", "Appointments")}`;

  const headers = [
    {
      key: "name",
      header: `${t("name", "Name")}`
    },
    {
      key: "startDateTime",
      header: `${t("startDateTime", "Start at")}` // TODO: Update translation keys
    },
    {
      key: "status",
      header: `${t("status", "Status")}`
    }
  ];

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();

      getAppointments(patientUuid, startDate, abortController)
        .then(({ data }) => {
          setPatientAppointments(data);
        })
        .catch(createErrorHandler());

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
      return <WidgetDataTable title={title} headers={headers} rows={rows} />;
    }
    return (
      <EmptyState
        displayText={t("appointments", "appointments")}
        name={t("appointments", "Appointments")}
        // showComponent={() =>
        //   openWorkspaceTab(
        //     AppointmentsForm,
        //     `${t("appointmentsForm", "Appointments Form")}`
        //   )
        // }
        // addComponent={AppointmentsForm}
      />
    );
  };

  return (
    <>{patientAppointments ? <RenderAppointments /> : <DataTableSkeleton />}</>
  );
}

type AppointmentOverviewProps = {
  basePath: string;
};
