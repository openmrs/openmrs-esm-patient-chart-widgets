import React from "react";
import dayjs from "dayjs";
import ProgramsForm from "./programs-form.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import Add16 from "@carbon/icons-react/es/add/16";
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
import { useTranslation } from "react-i18next";
import { createErrorHandler, useCurrentPatient } from "@openmrs/esm-framework";
import { fetchActiveEnrollments } from "./programs.resource";
import { openWorkspaceTab } from "../shared-utils";
import { PatientProgram } from "../types";
import styles from "./programs-overview.scss";

interface ProgramsOverviewProps {
  basePath: string;
}

const ProgramsOverview: React.FC<ProgramsOverviewProps> = () => {
  const programsToShowCount = 5;
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const [programs, setPrograms] = React.useState<Array<PatientProgram>>(null);
  const [error, setError] = React.useState(null);
  const [showAllPrograms, setShowAllPrograms] = React.useState(false);
  const displayText = t("programs", "program enrollments");
  const headerTitle = t("carePrograms", "Care Programs");

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

  const toggleShowAllPrograms = () => {
    setShowAllPrograms(!showAllPrograms);
  };

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
    return rows
      .slice(0, showAllPrograms ? rows.length : programsToShowCount)
      .map(row => ({
        id: row.uuid,
        display: row.display,
        dateEnrolled: dayjs(row.dateEnrolled).format("MMM-YYYY")
      }));
  };

  const RenderPrograms = () => {
    if (programs.length) {
      const rows = getRowItems(programs);
      return (
        <div>
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
                    {!showAllPrograms &&
                      programs?.length > programsToShowCount && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <span
                              style={{
                                display: "inline-block",
                                margin: "0.45rem 0rem"
                              }}
                            >
                              {`${programsToShowCount} / ${programs.length}`}{" "}
                              {t("items", "items")}
                            </span>
                            <Button
                              size="small"
                              kind="ghost"
                              onClick={toggleShowAllPrograms}
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
