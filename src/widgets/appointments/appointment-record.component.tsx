import React, { useState, useEffect } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import AppointmentsForm from "./appointments-form.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import { getAppointmentsByUuid } from "./appointments.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useRouteMatch } from "react-router-dom";
import VerticalLabelValue from "../../ui-components/cards/vertical-label-value.component";
import styles from "./appointment-record.css";
import { openWorkspaceTab } from "../shared-utils";

export default function AppointmentRecord(props: AppointmentRecordProps) {
  const [patientAppointment, setPatientAppointment] = useState(null);
  const match = useRouteMatch();
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const [startDate, setStartDate] = useState(dayjs().format());

  useEffect(() => {
    if (patientUuid && match.params) {
      const abortController = new AbortController();
      getAppointmentsByUuid(
        match.params["appointmentUuid"],
        abortController
      ).then(({ data }) => {
        setPatientAppointment(data);
      }, createErrorHandler());
    }
  }, [patientUuid, match.params, startDate]);

  return (
    <>
      {patientAppointment && (
        <SummaryCard
          name="Appointment"
          addComponent={AppointmentsForm}
          showComponent={() =>
            openWorkspaceTab(AppointmentsForm, "Appointment Form")
          }
        >
          <table className={styles.appointmentRecordTable}>
            <thead>
              <tr>
                <td colSpan={3} style={{ fontSize: "2rem" }}>
                  {patientAppointment?.serviceType?.name}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <VerticalLabelValue
                    label="Date"
                    value={dayjs(patientAppointment?.startDateTime).format(
                      "YYYY-MMM-DD"
                    )}
                    valueStyles={{ fontFamily: "Work Sans" }}
                  />
                </td>
                <td>
                  <VerticalLabelValue
                    label="Start Time"
                    value={dayjs(patientAppointment?.startDateTime).format(
                      "HH:mm A"
                    )}
                  />
                </td>
                <td>
                  <VerticalLabelValue
                    label="End Time"
                    value={dayjs(patientAppointment?.endDateTime).format(
                      "HH:mm A"
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <VerticalLabelValue
                    label="Comments"
                    value={patientAppointment?.comments}
                    valueStyles={{ whiteSpace: "pre-wrap" }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <VerticalLabelValue
                    label="Service Type"
                    value={patientAppointment?.serviceType?.name}
                  />
                </td>
                <td>
                  <VerticalLabelValue
                    label="Appointment kind"
                    value={patientAppointment?.appointmentKind}
                  />
                </td>
                <td>
                  <VerticalLabelValue
                    label="Status"
                    value={patientAppointment?.status}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </SummaryCard>
      )}

      {patientAppointment && (
        <SummaryCard name="Details" styles={{ marginTop: "1.625rem" }}>
          <div className={`omrs-type-body-regular`}>
            <table className={styles.appointmentRecordTable}>
              <thead className={styles.appointmentRecordTableHeader}>
                <tr>
                  <td>Last updated</td>
                  <td>Last updated by</td>
                  <td>Last updated location</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {dayjs(patientAppointment?.startDateTime).format(
                      "DD-MMM-YYYY"
                    )}
                  </td>
                  <td>
                    {patientAppointment?.service?.creatorName || "\u2014"}
                  </td>
                  <td>
                    {patientAppointment?.location
                      ? patientAppointment?.location?.name
                      : "\u2014"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SummaryCard>
      )}
    </>
  );
}

type AppointmentRecordProps = {};
