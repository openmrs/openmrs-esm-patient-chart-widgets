import React from "react";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { openWorkspaceTab } from "../shared-utils";

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

import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";

import { mapFromFHIRImmunizationBundle } from "./immunization-mapper";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { ImmunizationsForm } from "./immunizations-form.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import styles from "./immunizations-overview.css";

const ImmunizationsOverview: React.FC<ImmunizationsOverviewProps> = () => {
  const { t } = useTranslation();
  const [immunizations, setImmunizations] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [, patient, patientUuid] = useCurrentPatient();
  const displayText = t("immunizations", "immunizations");
  const headerTitle = t("immunizations", "Immunizations");

  React.useEffect(() => {
    if (patient) {
      const abortController = new AbortController();
      performPatientImmunizationsSearch(
        patient.identifier[0].value,
        patientUuid,
        abortController
      )
        .then(searchResult => {
          let allImmunizations = mapFromFHIRImmunizationBundle(searchResult);
          setImmunizations(allImmunizations);
        })
        .catch(error => {
          setError(error);
          createErrorHandler();
        });

      return () => abortController.abort();
    }
  }, [patient, patientUuid]);

  const headers = [
    {
      key: "vaccine",
      header: t("vaccine", "Vaccine")
    },
    {
      key: "vaccinationDate",
      header: t("vaccinationDate", "Vaccination date")
    }
  ];

  const launchImmunizationsForm = () => {
    openWorkspaceTab(
      ImmunizationsForm,
      t("immunizationsForm", "Immunizations Form")
    );
  };

  const RenderImmunizations: React.FC = () => {
    if (immunizations.length) {
      const rows = getRowItems(immunizations);
      return (
        <div>
          <div className={styles.immunizationsHeader}>
            <h4>{headerTitle}</h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add immunizations"
              onClick={launchImmunizationsForm}
            >
              Add
            </Button>
          </div>
          <TableContainer>
            <DataTable rows={rows} headers={headers} isSortable={true}>
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
    return <EmptyState displayText={displayText} headerTitle={headerTitle} />;
  };

  return (
    <>
      {immunizations ? (
        <RenderImmunizations />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={2} />
      )}
    </>
  );
};

function getRowItems(rows) {
  return rows.map((row, index) => ({
    id: `${index}`,
    vaccine: row.vaccineName,
    vaccinationDate: `${dayjs(row.existingDoses[0].occurrenceDateTime).format(
      "MMM-YYYY"
    )}`
  }));
}

export default ImmunizationsOverview;

type ImmunizationsOverviewProps = {
  basePath: string;
};
