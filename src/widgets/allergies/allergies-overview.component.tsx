import React from "react";
import capitalize from "lodash-es/capitalize";
import Add16 from "@carbon/icons-react/es/add/16";
import Button from "carbon-components-react/es/components/Button";
import Pagination from "carbon-components-react/es/components/Pagination";
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
import { useTranslation } from "react-i18next";
import { createErrorHandler, useCurrentPatient } from "@openmrs/esm-framework";
import {
  performPatientAllergySearch,
  Allergy
} from "./allergy-intolerance.resource";
import { openWorkspaceTab } from "../shared-utils";
import AllergyForm from "./allergy-form.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import styles from "./allergies-overview.scss";

const AllergiesOverview: React.FC<AllergiesOverviewProps> = () => {
  const allergiesToShowCount = 5;
  const { t } = useTranslation();
  const [isLoadingPatient, patient] = useCurrentPatient();
  const [allergies, setAllergies] = React.useState<Array<Allergy>>(null);
  const [error, setError] = React.useState(null);
  const [firstRowIndex, setFirstRowIndex] = React.useState(0);
  const [currentPageSize, setCurrentPageSize] = React.useState(5);

  const displayText = t("allergyIntolerances", "allergy intolerances");
  const headerTitle = t("allergies", "Allergies");
  const previousPage = t("previousPage", "Previous page");
  const nextPage = t("nextPage", "Next Page");
  const itemPerPage = t("itemPerPage", "Item per page");

  React.useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = performPatientAllergySearch(
        patient.identifier[0].value
      ).subscribe(
        allergies => {
          setAllergies(allergies);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );

      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient]);

  const headers = [
    {
      key: "display",
      header: t("name", "Name")
    },
    {
      key: "reactions",
      header: t("reactions", "Reactions")
    }
  ];

  const launchAllergiesForm = () => {
    openWorkspaceTab(AllergyForm, t("allergiesForm", "Allergies Form"));
  };

  const getRowItems = (rows: Array<Allergy>) => {
    return rows
      .slice(firstRowIndex, firstRowIndex + currentPageSize)
      .map(row => ({
        ...row,
        reactions: `${row.reactionManifestations?.join(", ") || ""} ${
          row.reactionSeverity ? `(${capitalize(row.reactionSeverity)})` : ""
        }`
      }));
  };

  const RenderAllergies: React.FC = () => {
    if (allergies.length) {
      const rows = getRowItems(allergies);
      const totalRows = allergies.length;
      return (
        <div>
          <div className={styles.allergiesHeader}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {headerTitle}
            </h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add allergies"
              onClick={launchAllergiesForm}
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
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </TableContainer>
          {totalRows > allergiesToShowCount && (
            <Pagination
              totalItems={totalRows}
              backwardText={previousPage}
              forwardText={nextPage}
              pageSize={currentPageSize}
              pageSizes={[5, 10, 15, 25]}
              itemsPerPageText={itemPerPage}
              onChange={({ page, pageSize }) => {
                if (pageSize !== currentPageSize) {
                  setCurrentPageSize(pageSize);
                }
                setFirstRowIndex(pageSize * (page - 1));
              }}
            />
          )}
        </div>
      );
    }
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchAllergiesForm}
      />
    );
  };

  return (
    <>
      {allergies ? (
        <RenderAllergies />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={allergiesToShowCount} />
      )}
    </>
  );
};

export default AllergiesOverview;

type AllergiesOverviewProps = { basePath: string };
