import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useConfig } from "@openmrs/esm-module-config";
import { merge } from "lodash-es";
import { ConfigObject } from "../../config-schema";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import useChartBasePath from "../../utils/use-chart-base";
import { formatDate } from "../heightandweight/heightandweight-helper";
import { openWorkspaceTab } from "../shared-utils";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import VitalsForm from "./vitals-form.component";
import styles from "./vitals-overview.css";

export default function VitalsOverview(props: VitalsOverviewProps) {
  const moduleConfig = useConfig() as ConfigObject;
  const config = merge(moduleConfig, props.config);
  const initialResultsDisplayed = 3;
  const [allVitals, setAllVitals] = useState(null);
  const [currentVitals, setCurrentVitals] = useState([]);
  const [vitalsExpanded, setVitalsExpanded] = useState(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const vitalsPath = chartBasePath + "/" + props.basePath;

  useEffect(() => {
    if (!isLoadingPatient && patientUuid) {
      const subscription = performPatientsVitalsSearch(
        config.concepts,
        patientUuid
      ).subscribe(vitals => {
        setAllVitals(vitals);
        setCurrentVitals(vitals.slice(0, initialResultsDisplayed));
      }, createErrorHandler());

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patientUuid, config]);

  useEffect(() => {
    if (allVitals && allVitals.length < initialResultsDisplayed) {
      setVitalsExpanded(true);
    }
  }, [allVitals]);

  const loadMoreVitals = () => {
    setCurrentVitals(allVitals);
    setVitalsExpanded(true);
  };

  return (
    <>
      {currentVitals && currentVitals.length > 0 ? (
        <SummaryCard
          name={t("vitals", "Vitals")}
          link={props.basePath}
          addComponent={VitalsForm}
          showComponent={() => openWorkspaceTab(VitalsForm, "Vitals Form")}
        >
          <table className={`omrs-type-body-regular ${styles.vitalsTable}`}>
            <thead>
              <tr className="omrs-medium">
                <td></td>
                <td>BP</td>
                <td>Rate</td>
                <td>Oxygen</td>
                <td colSpan={2}>Temp</td>
              </tr>
            </thead>
            <tbody>
              {currentVitals.map((vital, index) => {
                return (
                  <tr key={index}>
                    <td className="omrs-medium">{formatDate(vital.date)}</td>
                    <td>
                      {`${vital?.systolic} / ${vital?.diastolic}`}
                      {index === 0 && <span> mmHg</span>}
                    </td>
                    <td>
                      {vital?.pulse} {index === 0 && <span>bpm</span>}
                    </td>
                    <td>
                      {vital?.oxygenSaturation} {index === 0 && <span>%</span>}
                    </td>
                    <td>
                      {vital?.temperature}
                      {index === 0 && <span> &deg;C</span>}
                    </td>
                    <td>
                      <Link to={`${vitalsPath}/${vital.id}`}>
                        <svg
                          className="omrs-icon"
                          fill="var(--omrs-color-ink-low-contrast)"
                        >
                          <use xlinkHref="#omrs-icon-chevron-right" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {vitalsExpanded ? (
            <SummaryCardFooter linkTo={vitalsPath} />
          ) : (
            <div className={styles.vitalsFooter}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-medium-contrast)"
              >
                <use xlinkHref="#omrs-icon-chevron-down" />
              </svg>
              <button className="omrs-unstyled" onClick={loadMoreVitals}>
                <p className="omrs-bold">More</p>
              </button>
            </div>
          )}
        </SummaryCard>
      ) : (
        <EmptyState
          showComponent={() => openWorkspaceTab(VitalsForm, "Vitals Form")}
          addComponent={VitalsForm}
          name="Vitals"
          displayText="This patient has no vitals recorded in the system."
        />
      )}
    </>
  );
}

type VitalsOverviewProps = {
  basePath: string;
  config?: {};
};
