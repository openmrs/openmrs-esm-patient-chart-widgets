import React from "react";
import { getAppointments } from "./appointments.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import styles from "./appointments-overview.css";
import AppointmentsForm from "./appointments-form.component";
import { Link } from "react-router-dom";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";

export default function AppointmentsOverview(props: AppointmentOverviewProps) {
  const [patientAppointments, setPatientAppointments] = React.useState([]);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const startDate = dayjs().format();
  const [chartBasePath] = useChartBasePath();
  const appointmentsPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    if (!isLoadingPatient && patientUuid) {
      const abortController = new AbortController();

      getAppointments(patientUuid, startDate, abortController)
        .then(response => setPatientAppointments(response.data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patientUuid, startDate]);

  return (
    <>
      {patientAppointments && patientAppointments.length > 0 ? (
        <SummaryCard
          name="Appointments"
          link={appointmentsPath}
          showComponent={() =>
            openWorkspaceTab(AppointmentsForm, "Appointments Form")
          }
          addComponent={AppointmentsForm}
        >
          <table
            className={`omrs-type-body-regular ${styles.appointmentTable}`}
          >
            <thead>
              <tr>
                <td>Date</td>
                <td>Service Type</td>
                <td colSpan={2}>Status</td>
              </tr>
            </thead>
            <tbody>
              {patientAppointments.slice(0, 5).map(appointment => {
                return (
                  <tr key={appointment.uuid}>
                    <td test-id="startDate">
                      {dayjs(appointment.startDateTime).format("DD-MMM-YYYY")}
                    </td>
                    <td>{appointment.service.name}</td>
                    <td>{appointment.status}</td>
                    <td style={{ textAlign: "end" }}>
                      <Link to={`${appointmentsPath}/${appointment.uuid}`}>
                        <svg
                          className="omrs-icon"
                          fill="var(--omrs-color-ink-low-contrast)"
                        >
                          <use xlinkHref="#omrs-icon-chevron-right" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SummaryCard>
      ) : (
        <EmptyState
          showComponent={() =>
            openWorkspaceTab(AppointmentsForm, "Appointments Form")
          }
          addComponent={AppointmentsForm}
          name="Appointments"
          displayText="This patient has no appointments recorded in the system."
        />
      )}
    </>
  );
}

type AppointmentOverviewProps = {
  basePath: string;
};
