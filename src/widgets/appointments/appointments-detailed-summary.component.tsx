import React, { useState, useEffect } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import { getAppointments } from "./appointments.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./appointments-detailed-summary.css";
import { Link, useRouteMatch } from "react-router-dom";
import AppointmentsForm from "./appointments-form.component";
import { openWorkspaceTab } from "../shared-utils";
import { useTranslation, Trans } from "react-i18next";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

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
  const { t } = useTranslation();

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

  return (
    <>
      {patientAppointments?.length ? (
        <SummaryCard
          name={t("Appointments")}
          showComponent={() =>
            openWorkspaceTab(AppointmentsForm, `${t("Appointments Form")}`)
          }
          addComponent={AppointmentsForm}
        >
          <table className={styles.appointmentDetailedSummaryTable}>
            <thead>
              <tr>
                <td>
                  <Trans i18nKey="Date">Date</Trans>
                </td>
                <td>
                  <Trans i18nKey="Start time">Start time</Trans>
                </td>
                <td>
                  <Trans i18nKey="End time">End time</Trans>
                </td>
                <td>
                  <Trans i18nKey="Service type">Service type</Trans>
                </td>
                <td>
                  <Trans i18nKey="Appointment type">Appointment type</Trans>
                </td>
                <td colSpan={2}>
                  <Trans i18nKey="Status">Status</Trans>
                </td>
              </tr>
            </thead>
            <tbody>
              {patientAppointments?.map(appointment => {
                return (
                  <tr key={appointment?.uuid}>
                    <td>
                      {dayjs
                        .utc(appointment?.startDateTime)
                        .format("YYYY-MMM-DD")}
                    </td>
                    <td>
                      {dayjs.utc(appointment?.startDateTime).format("HH:mm A")}
                    </td>
                    <td>
                      {dayjs.utc(appointment?.endDateTime).format("HH:mm A")}
                    </td>
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
      ) : (
        <EmptyState
          name={t("Appointments")}
          showComponent={() =>
            openWorkspaceTab(AppointmentsForm, `${t("Appointments Form")}`)
          }
          addComponent={AppointmentsForm}
          displayText={t("appointments", "appointments")}
        />
      )}
    </>
  );
}

type AppointmentsDetailedSummaryProps = {};
