import React from "react";
import dayjs from "dayjs";
import Button from "carbon-components-react/es/components/Button";
import DataTableSkeleton from "carbon-components-react/es/components/DataTableSkeleton";
import DataTable, {
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react/es/components/DataTable";
import Add16 from "@carbon/icons-react/es/add/16";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import { useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";
import {
  Condition,
  performPatientConditionsSearch
} from "./conditions.resource";
import styles from "./conditions-overview.scss";

const ConditionsOverview: React.FC<ConditionsOverviewProps> = () => {
  const conditionsToShowCount = 5;
  const { t } = useTranslation();
  const [, patient] = useCurrentPatient();
  const [conditions, setConditions] = React.useState<Array<Condition>>(null);
  const [error, setError] = React.useState(null);
  const [showAllConditions, setShowAllConditions] = React.useState(false);
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

  const toggleShowAllConditions = () => {
    setShowAllConditions(!showAllConditions);
  };

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

  const getRowItems = (rows: Array<Condition>) => {
    return rows
      .slice(0, showAllConditions ? rows.length : conditionsToShowCount)
      .map(row => ({
        ...row,
        onsetDateTime: dayjs(row.onsetDateTime).format("MMM-YYYY")
      }));
  };

  const RenderConditions: React.FC = () => {
    if (conditions.length) {
      const rows = getRowItems(conditions);
      return (
        <div>
          <div className={styles.conditionsHeader}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {headerTitle}
            </h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add conditions"
              onClick={launchConditionsForm}
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
                          className={`${styles.productiveHeading01} ${styles.text02}`}
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
                    {!showAllConditions &&
                      conditions?.length > conditionsToShowCount && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <span
                              style={{
                                display: "inline-block",
                                margin: "0.45rem 0rem"
                              }}
                            >
                              {`${conditionsToShowCount} / ${conditions.length}`}{" "}
                              {t("items", "items")}
                            </span>
                            <Button
                              size="small"
                              kind="ghost"
                              onClick={toggleShowAllConditions}
                            >
                              {t("seeAll", "See all")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
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
        <DataTableSkeleton rowCount={conditionsToShowCount} />
      )}
    </>
  );
};

export default ConditionsOverview;

type ConditionsOverviewProps = {
  basePath: string;
};
