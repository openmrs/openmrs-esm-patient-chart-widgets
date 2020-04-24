import React, { useState, useEffect, Fragment } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./notes-detailed-summary.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { getEncounterObservableRESTAPI } from "./encounter.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { formatDate } from "../heightandweight/heightandweight-helper";
import { useTranslation } from "react-i18next";
import VisitNotes from "./visit-note.component";
import { isEmpty } from "lodash-es";
import { openWorkspaceTab } from "../shared-utils";

function NotesDetailedSummary(props: NotesDetailedSummaryProps) {
  const resultsPerPage = 10;
  const [patientNotes, setPatientNotes] = useState<PatientNotes[]>();
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showNextButton, setShowNextButton] = React.useState(false);
  const [showPreviousButton, setShowPreviousButton] = React.useState(false);
  const [currentPageResults, setCurrentPageResults] = React.useState([]);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();

  const match = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const subscription = getEncounterObservableRESTAPI(patientUuid).subscribe(
        (notes: any) => {
          setPatientNotes(notes.results);
          setTotalPages(Math.ceil(notes.results.length / resultsPerPage));
          setCurrentPageResults(notes.results.slice(0, resultsPerPage));
        },
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid, isLoadingPatient, patient]);

  useEffect(() => {
    {
      patientNotes && currentPage * resultsPerPage >= patientNotes.length
        ? setShowNextButton(false)
        : setShowNextButton(true);
      currentPage !== 1
        ? setShowPreviousButton(true)
        : setShowPreviousButton(false);
    }
  }, [patientNotes, currentPageResults, currentPage]);

  function toTitleCase(string: string) {
    if (string) {
      let results = string.split(" ").map(word => {
        return word[0].toUpperCase() + word.slice(1);
      });
      return results.join(" ");
    }
  }

  const nextPage = () => {
    let upperBound = currentPage * resultsPerPage + resultsPerPage;
    const lowerBound = currentPage * resultsPerPage;
    if (upperBound > patientNotes.length) {
      upperBound = patientNotes.length;
    }
    const pageResults = patientNotes.slice(lowerBound, upperBound);
    setCurrentPageResults(pageResults);
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    const lowerBound = resultsPerPage * (currentPage - 2);
    const upperBound = resultsPerPage * (currentPage - 1);
    const pageResults = patientNotes.slice(lowerBound, upperBound);
    setCurrentPageResults(pageResults);
    setCurrentPage(currentPage - 1);
  };

  function displayPatientNotes() {
    return (
      <SummaryCard
        name={t("Notes", "Notes")}
        addComponent={VisitNotes}
        showComponent={() => openWorkspaceTab(VisitNotes, "Visit Note")}
      >
        <table className={`omrs-type-body-regular ${styles.notesTable}`}>
          <thead>
            <tr className={styles.notesTableRow}>
              <th>DATE</th>
              <th style={{ textAlign: "left" }}>
                NOTE
                <svg
                  className="omrs-icon"
                  style={{
                    height: "0.813rem",
                    fill: "var(--omrs-color-ink-medium-contrast)"
                  }}
                >
                  <use xlinkHref="#omrs-icon-arrow-downward"></use>
                </svg>
                <span style={{ marginLeft: "1.25rem" }}>LOCATION</span>
              </th>
              <th style={{ textAlign: "left" }}>AUTHOR</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentPageResults &&
              currentPageResults.map(note => {
                return (
                  <Fragment key={note.uuid}>
                    <tr className={styles.notesTableDataRow}>
                      <td className={styles.noteDate}>
                        {formatDate(note?.encounterDatetime)}
                      </td>
                      <td className={styles.noteInfo}>
                        <span className="omrs-medium">
                          {note?.encounterType?.name}
                        </span>
                        <div
                          style={{
                            color: "var(--omrs-color-ink-medium-contrast)",
                            margin: "0rem"
                          }}
                        >
                          {toTitleCase(note?.location?.name)}
                        </div>
                      </td>
                      <td className={styles.noteAuthor}>
                        {!isEmpty(note.encounterProviders)
                          ? note?.encounterProviders[0].provider.person.display
                          : "\u2014"}
                      </td>
                      <td
                        style={{ textAlign: "end", paddingRight: "0.625rem" }}
                      >
                        <Link to={`${match.path}/${note.uuid}`}>
                          <svg className="omrs-icon">
                            <use
                              fill="var(--omrs-color-ink-low-contrast)"
                              xlinkHref="#omrs-icon-chevron-right"
                            ></use>
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <div>
            {showPreviousButton && (
              <button
                onClick={previousPage}
                className={`${styles.navButton} omrs-bold omrs-btn omrs-text-neutral omrs-rounded`}
              >
                <svg
                  className="omrs-icon"
                  fill="var(--omrs-color-ink-low-contrast)"
                >
                  <use xlinkHref="#omrs-icon-chevron-left" />
                </svg>
                Previous
              </button>
            )}
          </div>
          {patientNotes.length <= resultsPerPage ? (
            <div
              className="omrs-type-body-regular"
              style={{ fontFamily: "Work Sans" }}
            >
              <p style={{ color: "var(--omrs-color-ink-medium-contrast)" }}>
                No more notes available
              </p>
            </div>
          ) : (
            <div>
              Page {currentPage} of {totalPages}
            </div>
          )}
          <div>
            {showNextButton && (
              <button
                onClick={nextPage}
                className={`${styles.navButton} omrs-bold omrs-btn omrs-text-neutral omrs-rounded`}
              >
                Next
                <svg
                  className="omrs-icon"
                  fill="var(--omrs-color-ink-low-contrast)"
                >
                  <use xlinkHref="#omrs-icon-chevron-right" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </SummaryCard>
    );
  }

  function displayEmptyNotes() {
    return (
      <SummaryCard
        name="Notes"
        styles={{
          width: "100%",
          backgroundColor: "var(--omrs-color-bg-low-contrast)",
          boxShadow: "none",
          border: "none"
        }}
      >
        <div className={`${styles.emptyNotes} omrs-bold`}>
          <p>No Notes are documented</p>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {patientNotes && (
        <div className={styles.notesSummary}>
          {patientNotes.length > 0
            ? displayPatientNotes()
            : displayEmptyNotes()}
        </div>
      )}
    </>
  );
}

type NotesDetailedSummaryProps = {};

type PatientNotes = {
  uuid: string;
  display: string;
  encounterDatetime: string;
  location: { uuid: string; display: string; name: string };
  encounterType: { name: string; uuid: string };
  auditInfo: {
    creator: any;
    uuid: string;
    display: string;
    links: any;
    dateCreated: Date;
    changedBy?: any;
    dateChanged?: Date;
  };
};

export default NotesDetailedSummary;
