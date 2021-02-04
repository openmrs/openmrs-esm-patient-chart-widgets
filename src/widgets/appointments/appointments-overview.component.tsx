import React from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { useTranslation } from "react-i18next";

import {
  Button,
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import { getAppointments } from "./appointments.resource";
import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import AppointmentsForm from "./appointments-form.component";
import styles from "./appointments-overview.scss";

const AppointmentsOverview: React.FC<AppointmentOverviewProps> = () => {
  const { t } = useTranslation();
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const [appointments, setAppointments] = React.useState(null);
  const [error, setError] = React.useState(null);
  const startDate = dayjs().format();
  const displayText = t("appointments", "appointments");
  const headerTitle = t("appointments", "Appointments");

  React.useEffect(() => {
    if (!isLoadingPatient && patientUuid) {
      const abortController = new AbortController();

      getAppointments(patientUuid, startDate, abortController)
        .then(({ data }) => setAppointments(data))
        .catch(error => {
          setError(error);
          createErrorHandler();
        });

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patientUuid, startDate]);

  const launchAppointmentsForm = () => {
    openWorkspaceTab(
      AppointmentsForm,
      t("appointmentsForm", "Appointments form")
    );
  };

  const headers = [
    {
      key: "name",
      header: t("serviceType", "Service Type")
    },
    {
      key: "startDateTime",
      header: t("date", "Date")
    },
    {
      key: "status",
      header: t("status", "Status")
    }
  ];

  const getRowItems = rows =>
    rows.map(row => ({
      id: row.uuid,
      name: row.service?.name,
      startDateTime: dayjs.utc(row.startDateTime).format("DD-MMM-YYYY"),
      status: row.status
    }));

  const RenderAppointments: React.FC = () => {
    if (appointments.length) {
      const rows = getRowItems(appointments);
      return (
        <div>
          <div className={styles.allergiesHeader}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {headerTitle}
            </h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add appointments"
              onClick={launchAppointmentsForm}
            >
              {t("add", "Add")}
            </Button>
          </div>
          <TableContainer>
            <DataTable
              rows={rows}
              headers={headers}
              isSortable={true}
              size="short"
            >
              {({ rows, headers, getHeaderProps, getTableProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                            isSortable: header.isSortable
                          })}
                        >
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>
                            {cell.value?.content ?? cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </TableContainer>
        </div>
      );
    }
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchAppointmentsForm}
      />
    );
  };

  return (
    <>
      {appointments ? (
        <RenderAppointments />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
};

export default AppointmentsOverview;

type AppointmentOverviewProps = {
  basePath: string;
};
