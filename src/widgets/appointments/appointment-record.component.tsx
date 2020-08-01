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
import { useTranslation, Trans } from "react-i18next";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

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
  const { t } = useTranslation();

  useEffect(() => {
    if (patientUuid && match.params) {
      const abortController = new AbortController();
      getAppointmentsByUuid(match.params["appointmentUuid"], abortController)
        .then(({ data }) => setPatientAppointment(data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patientUuid, match.params, startDate]);

  return (
    <>
      {!!(patientAppointment && Object.entries(patientAppointment).length) && (
        <div className={styles.appointmentContainer}>
          <SummaryCard
            name={t("Appointment")}
            addComponent={AppointmentsForm}
            showComponent={() =>
              openWorkspaceTab(AppointmentsForm, `${t("Appointment Form")}`)
            }
          >
            <table
              className={`omrs-type-body-regular ${styles.appointmentRecordTable}`}
            >
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
                      label={t("Date")}
                      value={dayjs(patientAppointment?.startDateTime).format(
                        "YYYY-MMM-DD"
                      )}
                      valueStyles={{ fontFamily: "Work Sans" }}
                    />
                  </td>
                  <td>
                    <VerticalLabelValue
                      label={t("Start time")}
                      value={dayjs
                        .utc(patientAppointment?.startDateTime)
                        .format("HH:mm A")}
                    />
                  </td>
                  <td>
                    <VerticalLabelValue
                      label={t("End time")}
                      value={dayjs
                        .utc(patientAppointment?.endDateTime)
                        .format("HH:mm A")}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <VerticalLabelValue
                      label={t("Comments")}
                      value={patientAppointment?.comments}
                      valueStyles={{ whiteSpace: "pre-wrap" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <VerticalLabelValue
                      label={t("Service type")}
                      value={patientAppointment?.serviceType?.name}
                    />
                  </td>
                  <td>
                    <VerticalLabelValue
                      label={t("Appointment type")}
                      value={patientAppointment?.appointmentKind}
                    />
                  </td>
                  <td>
                    <VerticalLabelValue
                      label={t("Status")}
                      value={patientAppointment?.status}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </SummaryCard>
          <RecordDetails>
            <table className={styles.appointmentRecordTable}>
              <thead className={styles.appointmentRecordTableHeader}>
                <tr>
                  <th>
                    <Trans i18nKey="Last updated">Last updated</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="Last updated by">Last updated by</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="Last updated location">
                      Last updated location
                    </Trans>
                  </th>
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
          </RecordDetails>
        </div>
      )}
    </>
  );
}

type AppointmentRecordProps = {};
