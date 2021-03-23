import React from "react";
import dayjs from "dayjs";
import ProgramsForm from "./programs-form.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
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
import { fetchActiveEnrollments } from "./programs.resource";
import { openWorkspaceTab } from "../shared-utils";
import { PatientProgram } from "../types";
import styles from "./programs-overview.scss";
import PatientChartPagination from "../../ui-components/pagination/pagination.component";
import isEmpty from "lodash-es/isEmpty";
import paginate from "../../utils/paginate";

interface ProgramsOverviewProps {
  basePath: string;
}

const ProgramsOverview: React.FC<ProgramsOverviewProps> = () => {
  const programsToShowCount = 5;
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const [programs, setPrograms] = React.useState<Array<PatientProgram>>(null);
  const [error, setError] = React.useState(null);
  const displayText = t("programs", "program enrollments");
  const headerTitle = t("carePrograms", "Care Programs");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState([]);

  React.useEffect(() => {
    if (patientUuid) {
      const sub = fetchActiveEnrollments(patientUuid).subscribe(
        programs => setPrograms(programs),
        error => {
          setError(error);
          createErrorHandler();
        }
      );

      return () => sub.unsubscribe();
    }
  }, [patientUuid]);

  const launchProgramsForm = () => {
    openWorkspaceTab(ProgramsForm, t("programsForm", "Programs form"));
  };

  const handlePageChange = ({ page }) => {
    setPageNumber(page);
  };

  React.useEffect(() => {
    if (!isEmpty(programs)) {
      const [page, allPages] = paginate<any>(programs, pageNumber, pageSize);
      setCurrentPage(page);
    }
  }, [programs, pageNumber, pageSize]);

  const headers = [
    {
      key: "display",
      header: t("activePrograms", "Active programs")
    },
    {
      key: "dateEnrolled",
      header: t("dateEnrolled", "Date enrolled")
    }
  ];

  const getRowItems = (rows: Array<PatientProgram>) => {
    return rows.map(row => ({
      id: row.uuid,
      display: row.display,
      dateEnrolled: dayjs(row.dateEnrolled).format("MMM-YYYY")
    }));
  };

  const RenderPrograms = () => {
    if (programs.length) {
      const rows = getRowItems(currentPage);
      return (
        <div className={styles.programsWidgetContainer}>
          <div className={styles.programsHeader}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {headerTitle}
            </h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add programs"
              onClick={launchProgramsForm}
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
          <PatientChartPagination
            items={programs}
            onPageNumberChange={handlePageChange}
            pageNumber={pageNumber}
            pageSize={pageSize}
            pageUrl="programs"
            currentPage={currentPage}
          />
        </div>
      );
    }
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchProgramsForm}
      />
    );
  };

  return (
    <>
      {programs ? (
        <RenderPrograms />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={programsToShowCount} />
      )}
    </>
  );
};

export default ProgramsOverview;
