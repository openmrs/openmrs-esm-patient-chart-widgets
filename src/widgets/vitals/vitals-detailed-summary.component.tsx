import React from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { formatDate } from "../heightandweight/heightandweight-helper";
import styles from "./vitals-detailed-summary.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { useCurrentPatient, newWorkspaceItem } from "@openmrs/esm-api";
import VitalsForm from "./vitals-form.component";

export default function VitalsDetailedSummary(
  props: VitalsDetailedSummaryProps
) {
  const resultsPerPage = 15;
  const [patientVitals, setPatientVitals] = React.useState(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showNextButton, setShowNextButton] = React.useState(false);
  const [showPreviousButton, setShowPreviousButton] = React.useState(false);
  const [currentPageResults, setCurrentPageResults] = React.useState([]);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const match = useRouteMatch();

  React.useEffect(() => {
    if (!isLoadingPatient && patient) {
      const subscription = performPatientsVitalsSearch(patient.id).subscribe(
        vitals => {
          setPatientVitals(vitals);
          setTotalPages(Math.ceil(vitals.length / resultsPerPage));
          setCurrentPageResults(vitals.slice(0, resultsPerPage));
        },
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patient]);

  React.useEffect(() => {
    {
      patientVitals && currentPage * resultsPerPage > patientVitals.length
        ? setShowNextButton(false)
        : setShowNextButton(true);
      currentPage !== 1
        ? setShowPreviousButton(true)
        : setShowPreviousButton(false);
    }
  }, [currentPageResults, currentPage, patientVitals]);

  const nextPage = () => {
    let upperBound = currentPage * resultsPerPage + resultsPerPage;
    const lowerBound = currentPage * resultsPerPage;
    if (upperBound > patientVitals.length) {
      upperBound = patientVitals.length;
    }
    const pageResults = patientVitals.slice(lowerBound, upperBound);
    setCurrentPageResults(pageResults);
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    const lowerBound = resultsPerPage * (currentPage - 2);
    const upperBound = resultsPerPage * (currentPage - 1);
    const pageResults = patientVitals.slice(lowerBound, upperBound);
    setCurrentPageResults(pageResults);
    setCurrentPage(currentPage - 1);
  };

  const openVitalsWorkspaceTab = (componentToAdd, componentName) => {
    newWorkspaceItem({
      component: componentToAdd,
      name: componentName,
      props: {
        match: { params: {} }
      },
      inProgress: false,
      validations: (workspaceTabs: any[]) =>
        workspaceTabs.findIndex(tab => tab.component === componentToAdd)
    });
  };

  function displayPatientsVitals() {
    return (
      <SummaryCard
        name="Vitals"
        styles={{ width: "100%" }}
        addComponent={VitalsForm}
        showComponent={() => openVitalsWorkspaceTab(VitalsForm, "Vitals Form")}
      >
        <table className={styles.vitalsTable}>
          <thead>
            <tr className="omrs-bold">
              <td></td>
              <td>BP</td>
              <td>Rate</td>
              <td>Oxygen</td>
              <td colSpan={2}>Temp</td>
            </tr>
          </thead>
          <tbody>
            {currentPageResults &&
              currentPageResults.map((vital, index) => {
                return (
                  <React.Fragment key={vital.id}>
                    <tr>
                      <td>{formatDate(vital.date)}</td>
                      <td>
                        {`${vital.systolic} / ${vital.diastolic}`}
                        {index === 0 && <span> mmHg </span>}
                      </td>
                      <td>
                        {vital.pulse} {index === 0 && <span>bpm</span>}
                      </td>
                      <td>
                        {vital.oxygenation} {index === 0 && <span>%</span>}
                      </td>
                      <td>
                        {vital.temperature}
                        {index === 0 && <span> &#8451; </span>}
                      </td>
                      <td>
                        <Link to={`${match.path}/${vital.id}`}>
                          <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                            <use xlinkHref="#omrs-icon-chevron-right" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  </React.Fragment>
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
                <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                  <use xlinkHref="#omrs-icon-chevron-left" />
                </svg>
                Previous
              </button>
            )}
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div>
            {showNextButton && (
              <button
                onClick={nextPage}
                className={`${styles.navButton} omrs-bold omrs-btn omrs-text-neutral omrs-rounded`}
              >
                Next
                <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                  <use xlinkHref="#omrs-icon-chevron-right" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </SummaryCard>
    );
  }
  function displayNoPatientsVitals() {
    return (
      <SummaryCard
        name="Vitals"
        styles={{
          width: "100%",
          backgroundColor: "var(--omrs-color-bg-low-contrast)",
          boxShadow: "none",
          border: "none"
        }}
        addComponent={VitalsForm}
        showComponent={() => openVitalsWorkspaceTab(VitalsForm, "Vitals Form")}
      >
        <div className={`${styles.vitalsAbsent} omrs-bold`}>
          <p>No Vitals are documented</p>
          <button
            className="omrs-unstyled"
            onClick={() => openVitalsWorkspaceTab(VitalsForm, "Vitals Form")}
          >
            Add
          </button>
          {` `} new set of vitals.
        </div>
      </SummaryCard>
    );
  }
  return (
    <>
      {patientVitals && (
        <div className={styles.vitalsSummary}>
          {patientVitals.length > 0
            ? displayPatientsVitals()
            : displayNoPatientsVitals()}
        </div>
      )}
    </>
  );
}

type VitalsDetailedSummaryProps = {};
