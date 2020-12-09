import React from "react";

import dayjs from "dayjs";
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

import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";

import { ConditionsForm } from "./conditions-form.component";
import {
  Condition,
  performPatientConditionsSearch
} from "./conditions.resource";
import styles from "./conditions-overview.scss";

const ConditionsOverview: React.FC<ConditionsOverviewProps> = () => {
  const { t } = useTranslation();
  const [, patient] = useCurrentPatient();
  const [conditions, setConditions] = React.useState<Array<Condition>>(null);
  const [error, setError] = React.useState(null);
  const displayText = t("conditions", "conditions");
  const headerTitle = t("conditions", "Conditions");

  React.useEffect(() => {
    if (patient) {
      const sub = performPatientConditionsSearch(
        patient.identifier[0].value
      ).subscribe(
        conditions => {
          setConditions(conditions);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );

      return () => sub.unsubscribe();
    }
  }, [patient]);

  const launchConditionsForm = () => {
    openWorkspaceTab(ConditionsForm, t("conditionsForm", "Conditions form"));
  };

  const headers = [
    {
      key: "display",
      header: t("activeConditions", "Active Conditions")
    },
    {
      key: "onsetDateTime",
      header: t("since", "Since")
    }
  ];

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      display: row.display,
      onsetDateTime: dayjs(row.onsetDateTime).format("MMM-YYYY")
    }));

  const RenderConditions = () => {
    if (conditions.length) {
      const rows = getRowItems(conditions);
      return (
        <div>
          <div className={styles.conditionsHeader}>
            <h4>{headerTitle}</h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add conditions"
              onClick={launchConditionsForm}
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
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchConditionsForm}
      />
    );
  };

  return (
    <>
      {conditions ? (
        <RenderConditions />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
};

export default ConditionsOverview;

type ConditionsOverviewProps = {
  basePath: string;
};
