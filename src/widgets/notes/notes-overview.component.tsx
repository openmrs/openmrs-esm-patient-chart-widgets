import React from "react";
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
import styles from "./notes-overview.scss";
import { useTranslation } from "react-i18next";
import {
  createErrorHandler,
  useCurrentPatient,
  switchTo
} from "@openmrs/esm-framework";
import {
  getEncounterObservableRESTAPI,
  PatientNote
} from "./encounter.resource";
import { formatNotesDate } from "./notes-helper";
import PatientChartPagination from "../../ui-components/pagination/pagination.component";
import { usePaginate } from "../../utils/use-paginate";

const NotesOverview: React.FC<NotesOverviewProps> = () => {
  const notesToShowCount = 5;
  const { t } = useTranslation();
  const [, patient, patientUuid] = useCurrentPatient();
  const [notes, setNotes] = React.useState<Array<PatientNote>>(null);
  const [error, setError] = React.useState(null);
  const [showAllNotes, setShowAllNotes] = React.useState(false);
  const displayText = t("notes", "notes");
  const headerTitle = t("notes", "Notes");
  const [pageNumber, setPageNumber] = React.useState(1);

  React.useEffect(() => {
    if (patient && patientUuid) {
      const sub = getEncounterObservableRESTAPI(patientUuid).subscribe(
        notes => setNotes(notes),
        error => {
          setError(error);
          createErrorHandler();
        }
      );
      return () => sub.unsubscribe();
    }
  }, [patient, patientUuid]);

  const handlePageChange = ({ page }) => {
    setPageNumber(page);
  };

  const [page] = usePaginate<PatientNote>(notes, pageNumber);

  const launchVisitNoteForm = () => {
    const url = `/patient/${patientUuid}/visitnotes/form`;
    switchTo("workspace", url, {
      title: t("visitNote", "Visit Note")
    });
  };

  const headers = [
    {
      key: "encounterDate",
      header: t("date", "Date")
    },
    {
      key: "encounterType",
      header: t("encounterType", "Encounter type")
    },
    {
      key: "encounterLocation",
      header: t("location", "Location")
    },
    {
      key: "encounterAuthor",
      header: t("author", "Author")
    }
  ];

  const getRowItems = (rows: Array<PatientNote>) => {
    return rows.map(row => ({
      ...row,
      encounterDate: formatNotesDate(row.encounterDate),
      author: row.encounterAuthor ? row.encounterAuthor : "\u2014"
    }));
  };

  const RenderNotes: React.FC = () => {
    if (notes.length) {
      const rows = getRowItems(page);
      return (
        <div className={styles.notesWidgetContainer}>
          <div className={styles.notesHeader}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {headerTitle}
            </h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add visit note"
              onClick={launchVisitNoteForm}
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
                      {headers.map((header, index) => (
                        <TableHeader
                          key={index}
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
            items={notes}
            onPageNumberChange={handlePageChange}
            pageNumber={pageNumber}
            pageUrl="encounters"
            currentPage={page}
          />
        </div>
      );
    }
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchVisitNoteForm}
      />
    );
  };

  return (
    <>
      {notes ? (
        <RenderNotes />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={notesToShowCount} />
      )}
    </>
  );
};

export default NotesOverview;

type NotesOverviewProps = {
  basePath: string;
};
