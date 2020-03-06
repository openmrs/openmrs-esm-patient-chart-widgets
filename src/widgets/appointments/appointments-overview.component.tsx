import React, { useState, useEffect } from "react";
import { getAppointments } from "./appointments.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import styles from "./appointments-overview.css";
import Sidebar from "../../ui-components/sidebar/sidebar.component";
import AppointmentsForm from "./appointments-form.component";
import { useRouteMatch, Link } from "react-router-dom";

export default function AppointmentsOverview(props: AppointmentOverviewProps) {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const startDate = dayjs().format();

  useEffect(() => {
    const abortController = new AbortController();
    if (patientUuid) {
      getAppointments(patientUuid, startDate, abortController).then(
        (response: any) => {
          setPatientAppointments(response.data);
        }
      );
    }
  }, [patientUuid, startDate]);

  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const appointmentsPath = chartBasePath + "/" + props.basePath;

  function restAPIAppointmentsOverview() {
    return (
      <SummaryCard
        name="Appointments Overview"
        link={`/patient/${patientUuid}/chart/appointments`}
      >
        <table className={styles.appointmentTable}>
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
                    {dayjs(appointment.startDateTime).format("DD:MM:YY")}
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
    );
  }

  return (
    <>
      {patientAppointments && patientAppointments.length ? (
        restAPIAppointmentsOverview()
      ) : (
        <SummaryCard name="Appointments">
          <div className={styles.emptyAppointments}>
            <p className="omrs-type-body-regular">No Appointments scheduled.</p>
          </div>
        </SummaryCard>
      )}
    </>
  );
}

type AppointmentOverviewProps = {
  basePath: string;
};
