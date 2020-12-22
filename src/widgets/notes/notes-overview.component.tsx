import React from "react";

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

import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { switchTo } from "@openmrs/esm-extensions";

import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";

import {
  getEncounterObservableRESTAPI,
  PatientNote
} from "./encounter.resource";
import { formatNotesDate } from "./notes-helper";
import VisitNotes from "./visit-notes-form.component";
import styles from "./notes-overview.scss";

const NotesOverview: React.FC<NotesOverviewProps> = () => {
  const { t } = useTranslation();
  const [, patient, patientUuid] = useCurrentPatient();
  const [notes, setNotes] = React.useState<Array<PatientNote>>(null);
  const [error, setError] = React.useState(null);
  const displayText = t("notes", "notes");
  const headerTitle = t("notes", "Notes");

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

  // const url = `/patient/${patientUuid}/drugorder/basket`;
  // switchTo('workspace', url, { title: t('orderBasket', 'Order Basket') });

  const launchVisitNoteForm = () => {
    const url = `/patient/${patientUuid}/visitnotes/form`;
    switchTo("workspace", url, {
      title: t("visitNote", "Visit Note")
    });
    // openWorkspaceTab(VisitNotes, t("visitNotesForm", "Visit note form"));
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

  const RenderNotes: React.FC = () => {
    if (notes.length) {
      const rows = getRowItems(notes);
      return (
        <div>
          <div className={styles.notesHeader}>
            <h4>{headerTitle}</h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add visit note"
              onClick={launchVisitNoteForm}
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
        <DataTableSkeleton />
      )}
    </>
  );
};

function getRowItems(rows: Array<PatientNote>) {
  return rows.map(row => ({
    ...row,
    encounterDate: formatNotesDate(row.encounterDate),
    author: row.encounterAuthor ? row.encounterAuthor : "\u2014"
  }));
}

export default NotesOverview;

type NotesOverviewProps = {
  basePath: string;
};
