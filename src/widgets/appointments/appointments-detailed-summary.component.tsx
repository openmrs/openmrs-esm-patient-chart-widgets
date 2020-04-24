import React, { useState, useEffect } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import { getAppointments } from "./appointments.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { SummaryCard } from "../../openmrs-esm-patient-chart-widgets";
import styles from "./appointments-detailed-summary.css";
import { Link, useRouteMatch } from "react-router-dom";
import AppointmentsForm from "./appointments-form.component";
import { isEmpty } from "lodash-es";
import { openWorkspaceTab } from "../shared-utils";

export default function AppointmentsDetailedSummary(
  props: AppointmentsDetailedSummaryProps
) {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const match = useRouteMatch();
  const appointmentsPath = match.path.replace(":subview?", "details");

  const [startDate, setStartDate] = useState(dayjs().format());

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      getAppointments(patientUuid, startDate, abortController).then(
        ({ data }) => setPatientAppointments(data),
        createErrorHandler()
      );
      return () => abortController.abort();
    }
  }, [patientUuid, startDate]);

  function displayPatientAppointments() {
    return (
      <SummaryCard name="Appointments Detailed Summary">
        <table className={styles.appointmentDetailedSummaryTable}>
          <thead>
            <tr>
              <td>Date</td>
              <td>Start Time</td>
              <td>End Time</td>
              <td>Service Type</td>
              <td>Appointment Kind</td>
              <td colSpan={2}>Status</td>
            </tr>
          </thead>
          <tbody>
            {patientAppointments &&
              patientAppointments.map(appointment => {
                return (
                  <tr key={appointment?.uuid}>
                    <td>
                      {dayjs(appointment?.startDateTime).format("YYYY-MMM-DD")}
                    </td>
                    <td>
                      {dayjs(appointment.startDateTime).format("HH:mm A")}
                    </td>
                    <td>{dayjs(appointment.endDateTime).format("HH:mm A")}</td>
                    <td>{appointment?.serviceType?.name}</td>
                    <td>{appointment?.appointmentKind}</td>
                    <td>{appointment?.status}</td>
                    <td>
                      <Link to={`${appointmentsPath}/${appointment?.uuid}`}>
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

  function displayNoPatientAppointments() {
    return (
      isEmpty(patientAppointments) && (
        <SummaryCard
          name="Appointments"
          styles={{ width: "100%" }}
          addComponent={AppointmentsForm}
          showComponent={() =>
            openWorkspaceTab(AppointmentsForm, "Appointment Form")
          }
        >
          <div className={styles.allergyMargin}>
            <p className="omrs-bold">
              The patient's appointment schedule is not documented.
            </p>
            <p className="omrs-bold">
              <button
                style={{ cursor: "pointer" }}
                className="omrs-btn omrs-outlined-action"
                type="button"
                onClick={() =>
                  openWorkspaceTab(AppointmentsForm, "Appointment Form")
                }
              >
                Add patient appointment
              </button>
            </p>
          </div>
        </SummaryCard>
      )
    );
  }

  return !isEmpty(patientAppointments)
    ? displayPatientAppointments()
    : displayNoPatientAppointments();
}
type AppointmentsDetailedSummaryProps = {};
