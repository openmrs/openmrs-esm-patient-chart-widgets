import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import useChartBasePath from "../../utils/use-chart-base";
import { openWorkspaceTab } from "../shared-utils";
import { getAppointments } from "./appointments.resource";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import AppointmentsForm from "./appointments-form.component";
import styles from "./appointments-overview.css";

export default function AppointmentsOverview(props: AppointmentOverviewProps) {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const startDate = dayjs().format();
  const chartBasePath = useChartBasePath();
  const appointmentsPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  useEffect(() => {
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
      {patientAppointments?.length > 0 ? (
        <SummaryCard
          name={t("appointments", "Appointments")}
          link={appointmentsPath}
          addComponent={AppointmentsForm}
          showComponent={() =>
            openWorkspaceTab(
              AppointmentsForm,
              `${t("appointmentsForm", "Appointments Form")}`
            )
          }
        >
          <table
            className={`omrs-type-body-regular ${styles.appointmentTable}`}
          >
            <thead>
              <tr>
                <td>
                  <Trans i18nKey="date">Date</Trans>
                </td>
                <td>
                  <Trans i18nKey="serviceType">Service Type</Trans>
                </td>
                <td colSpan={2}>
                  <Trans i18nKey="status">Status</Trans>
                </td>
              </tr>
            </thead>
            <tbody>
              {patientAppointments
                ?.filter(m => !!m)
                .slice(0, 5)
                .map(appointment => {
                  return (
                    <tr key={appointment.uuid}>
                      <td>
                        {dayjs
                          .utc(appointment.startDateTime)
                          .format("DD-MMM-YYYY")}
                      </td>
                      <td>{appointment.service?.name}</td>
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
          name={t("appointments", "Appointments")}
          showComponent={() =>
            openWorkspaceTab(
              AppointmentsForm,
              `${t("appointmentsForm", "Appointments Form")}`
            )
          }
          addComponent={AppointmentsForm}
          displayText={t("appointments", "appointments")}
        />
      )}
    </>
  );
}

type AppointmentOverviewProps = {
  basePath: string;
};
