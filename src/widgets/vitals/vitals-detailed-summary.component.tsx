import React, { useEffect, useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { formatDate } from "../heightandweight/heightandweight-helper";
import styles from "./vitals-detailed-summary.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import VitalsForm from "./vitals-form.component";
import { openWorkspaceTab } from "../shared-utils";
import { ConfigObject } from "../../config-schema";
import WithConfig from "../../with-config";
import { useTranslation, Trans } from "react-i18next";

function VitalsDetailedSummary(props: VitalsDetailedSummaryProps) {
  const resultsPerPage = 15;
  const [patientVitals, setPatientVitals] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showPreviousButton, setShowPreviousButton] = useState(false);
  const [currentPageResults, setCurrentPageResults] = useState([]);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const match = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const subscription = performPatientsVitalsSearch(
        props.config.concepts,
        patient.id
      ).subscribe(vitals => {
        setPatientVitals(vitals);
        setTotalPages(Math.ceil(vitals.length / resultsPerPage));
        setCurrentPageResults(vitals.slice(0, resultsPerPage));
      }, createErrorHandler());

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patient, props.config]);

  useEffect(() => {
    {
      patientVitals && currentPage * resultsPerPage >= patientVitals.length
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

  return (
    <>
      {patientVitals && patientVitals.length ? (
        <SummaryCard
          name={t("Vitals", "Vitals")}
          styles={{ width: "100%" }}
          addComponent={VitalsForm}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("Vitals Form")}`)
          }
        >
          <table className={styles.vitalsTable}>
            <thead>
              <tr>
                <td></td>
                <td>
                  <Trans i18nKey="BP">BP</Trans>
                </td>
                <td>
                  <Trans i18nKey="Rate">Rate</Trans>
                </td>
                <td>
                  <Trans i18nKey="Oxygen">Oxygen</Trans>
                </td>
                <td>
                  <Trans i18nKey="Temp">Temp</Trans>
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {currentPageResults &&
                currentPageResults.map((vital, index) => {
                  return (
                    <React.Fragment key={vital.id}>
                      <tr>
                        <td className="omrs-medium">
                          {formatDate(vital.date)}
                        </td>
                        <td>
                          {vital.systolic} / {vital.diastolic}
                          {index === 0 && <span> mmHg </span>}
                        </td>
                        <td>
                          {vital.pulse} {index === 0 && <span>bpm</span>}
                        </td>
                        <td>
                          {vital.oxygenSaturation}{" "}
                          {index === 0 && <span>%</span>}
                        </td>
                        <td>
                          {vital.temperature}
                          {index === 0 && <span> &deg;C</span>}
                        </td>
                        <td>
                          <Link to={`${match.path}/${vital.id}`}>
                            <svg
                              className="omrs-icon"
                              fill="var(--omrs-color-ink-low-contrast)"
                            >
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
                  <svg
                    className="omrs-icon"
                    fill="var(--omrs-color-ink-low-contrast)"
                  >
                    <use xlinkHref="#omrs-icon-chevron-left" />
                  </svg>
                  <Trans i18nKey="Previous">Previous</Trans>
                </button>
              )}
            </div>
            {patientVitals.length <= resultsPerPage ? (
              <div
                className="omrs-type-body-regular"
                style={{ fontFamily: "Work Sans" }}
              >
                <p style={{ color: "var(--omrs-color-ink-medium-contrast)" }}>
                  <Trans i18nKey="No more vitals available">
                    No more vitals available
                  </Trans>
                </p>
              </div>
            ) : (
              <div>
                <Trans i18nKey="Page">Page</Trans> {currentPage}{" "}
                <Trans i18nKey="of">of</Trans> {totalPages}
              </div>
            )}
            <div>
              {showNextButton && (
                <button
                  onClick={nextPage}
                  className={`${styles.navButton} omrs-bold omrs-btn omrs-text-neutral omrs-rounded`}
                >
                  <Trans i18nKey="Next">Next</Trans>
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
      ) : (
        <EmptyState
          name={t("Vitals", "Vitals")}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("Vitals Form", "Vitals Form")}`)
          }
          addComponent={VitalsForm}
          displayText={t("vitals", "vitals")}
        />
      )}
    </>
  );
}

type VitalsDetailedSummaryProps = {
  config: ConfigObject;
};

export default WithConfig(VitalsDetailedSummary);
