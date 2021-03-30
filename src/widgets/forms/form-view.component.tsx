import React from "react";
import { createErrorHandler, switchTo } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { Encounter, Form } from "../types";
import styles from "./form-view.component.scss";
import { getStartedVisit, visitItem } from "../visit/visit-utils";
import { startVisitPrompt } from "../visit/start-visit-prompt.component";
import Search from "carbon-components-react/es/components/Search";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import EmptyDataIllustration from "../../ui-components/empty-state/empty-data-illustration.component";
import { Tile } from "carbon-components-react/es/components/Tile";
import paginate from "../../utils/paginate";
import PatientChartPagination from "../../ui-components/pagination/pagination.component";
import DataTable, {
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react/es/components/DataTable";
import { fetchPatientEncounters } from "./forms.resource";
import dayjs from "dayjs";

interface FormViewProps {
  forms: Array<Form>;
  patientUuid: string;
  encounterUuid?: string;
}

interface EmptyFormViewProps {
  action: string;
}

const filterFormsByName = (formName: string, forms: Array<Form>) => {
  return forms.filter(
    form => form.name.toLowerCase().search(formName.toLowerCase()) !== -1
  );
};

const EmptyFormView: React.FC<EmptyFormViewProps> = ({ action }) => {
  const { t } = useTranslation();

  return (
    <Tile light className={styles.formTile}>
      <EmptyDataIllustration />
      <p className={styles.content}>
        {t("noFormsFound", "Sorry, no forms have been found")}
      </p>
      <p className={styles.action}>{action}</p>
    </Tile>
  );
};

const FormView: React.FC<FormViewProps> = ({
  forms,
  patientUuid,
  encounterUuid
}) => {
  const { t } = useTranslation();
  const [activeVisit, setActiveVisit] = React.useState<visitItem>();
  const [searchTerm, setSearchTerm] = React.useState<string>(null);
  const [allForms, setAllForms] = React.useState<Array<Form>>(forms);
  const [pageNumber, setPageNumber] = React.useState(1);

  const [currentPage, setCurrentPage] = React.useState<Array<Form>>([]);

  const handleSearch = debounce(searchTerm => {
    setSearchTerm(searchTerm);
  }, 300);

  const handlePageChange = ({ page }) => {
    setPageNumber(page);
  };

  React.useEffect(() => {
    if (!isEmpty(allForms)) {
      const [page, allPages] = paginate<Form>(allForms, pageNumber, 5);
      setCurrentPage(page);
    }
  }, [allForms, pageNumber]);

  React.useEffect(() => {
    const updatedForms = !isEmpty(searchTerm)
      ? filterFormsByName(searchTerm, forms)
      : forms;
    setAllForms(updatedForms);
  }, [searchTerm, forms]);

  const launchFormEntry = (formName: string) => {
    const formUuid = currentPage.find(form => form.name === formName).uuid;
    if (activeVisit && formUuid) {
      const url = `/patient/${patientUuid}/formentry`;
      switchTo("workspace", url, {
        title: t("formEntry", `${formName}`),
        formUuid: formUuid,
        encounterUuid: encounterUuid
      });
    } else {
      startVisitPrompt();
    }
  };
  const formatDate = (strDate: string | Date) => {
    const date = dayjs(strDate);
    const today = dayjs(new Date());
    if (
      date.date() === today.date() &&
      date.month() === today.month() &&
      date.year() === today.year()
    ) {
      return `Today @ ${date.format("HH:mm")}`;
    }
    return date.format("DD - MMM - YYYY @ HH:mm");
  };

  const tableHeaders = [
    {
      key: "lastCompleted",
      header: t("lastCompleted", "Last Completed")
    },
    { key: "formName", header: t("formName", "Form Name (A-Z)") }
  ];

  const tableRows = currentPage.map((form, index) => {
    return {
      id: `${index}`,
      lastCompleted: form.lastCompleted && formatDate(form.lastCompleted),
      formName: form.name,
      formUuid: form.uuid
    };
  });

  React.useEffect(() => {
    const sub = getStartedVisit.subscribe(visit => {
      setActiveVisit(visit);
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className={styles.formContainer}>
      {isEmpty(currentPage) ? (
        <EmptyFormView
          action={t(
            "emptyFormHint",
            "The patient does not have a completed form, try complete a form"
          )}
        />
      ) : (
        <>
          <Search
            id="searchInput"
            labelText=""
            placeholder={t("searchForForm", "Search for a form")}
            onChange={evnt => handleSearch(evnt.target.value)}
          />
          <>
            {isEmpty(allForms) && !isEmpty(searchTerm) && (
              <EmptyFormView
                action={t(
                  "formSearchHint",
                  "Try searching for the form using an alternative name or keyword"
                )}
              />
            )}
            <>
              {!isEmpty(allForms) && (
                <TableContainer className={styles.tableContainer}>
                  <DataTable
                    rows={tableRows}
                    headers={tableHeaders}
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
                            <TableRow
                              key={row.id}
                              onClick={() =>
                                launchFormEntry(row.cells[1].value)
                              }
                            >
                              {row.cells.map(cell => {
                                return (
                                  <TableCell
                                    style={{
                                      color: `${
                                        cell.value ? "#525252" : "#0f62fe"
                                      }`
                                    }}
                                    key={cell.id}
                                  >
                                    {cell.value
                                      ? cell.value
                                      : `${t("never", "Never")}`}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </DataTable>
                </TableContainer>
              )}
              <PatientChartPagination
                items={allForms}
                onPageNumberChange={handlePageChange}
                pageNumber={pageNumber}
                pageSize={5}
                pageUrl="forms"
                currentPage={currentPage}
              />
            </>
          </>
        </>
      )}
    </div>
  );
};

export default FormView;
