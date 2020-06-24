import React, { useState, useEffect } from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { createErrorHandler, reportError } from "@openmrs/esm-error-handling";
import { useCurrentPatient, openmrsFetch } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccinationRow";
import { useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";
import { map, orderBy, get, find } from "lodash-es";
import { fromImmunizationSearchResult } from "./immunization-mapper";

const rootConfigPath = "/frontend/spa-configs/";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [allImmunizations, setAllImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  const mergeConfigAndSearchResult = ([config, searchResult]) => {
    let immunizationForPatient = fromImmunizationSearchResult(searchResult);
    const consolidatedImmunizations = map(
      config.immunizations,
      immunizationFromConfig => {
        const matchingPatientImmunization = find(
          immunizationForPatient,
          patientImmunization =>
            //TODO: Change to UUIDs
            immunizationFromConfig.vaccineName ===
            patientImmunization.vaccineName
        );
        if (!matchingPatientImmunization) {
          return immunizationFromConfig;
        }
        immunizationFromConfig.doses = matchingPatientImmunization.doses;
        return immunizationFromConfig;
      }
    );

    const sortedImmunizationsForPatient = orderBy(
      consolidatedImmunizations,
      [immunization => get(immunization, "doses.length", 0)],
      ["desc"]
    );
    setAllImmunizations(sortedImmunizationsForPatient);
  };

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const abortController = new AbortController();

      const configPromise = openmrsFetch(`${rootConfigPath}/immunizations.json`)
        .then(response => response.data)
        .catch(error => {
          setAllImmunizations([]);
          reportError(error);
        });

      const searchResultPromise = performPatientImmunizationsSearch(
        patient.identifier[0].value,
        patientUuid,
        abortController
      );

      Promise.all([configPromise, searchResultPromise])
        .then(mergeConfigAndSearchResult)
        .catch(createErrorHandler);

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient, patientUuid]);

  function displayImmunizations() {
    return (
      <SummaryCard
        name={t("immunizations", "Immunizations")}
        styles={{ width: "100%" }}
      >
        <table className={`omrs-type-body-regular ${styles.immunizationTable}`}>
          <thead>
            <tr>
              <td>{t("vaccine", "VACCINE")}</td>
              <td>{t("recent vaccination", "RECENT VACCINATION")}</td>
              <td />
            </tr>
          </thead>
          <tbody>
            {allImmunizations &&
              allImmunizations.map((immunizations, i) => {
                return (
                  <VaccinationRow
                    key={i}
                    immunization={immunizations}
                  ></VaccinationRow>
                );
              })}
          </tbody>
        </table>
      </SummaryCard>
    );
  }

  function displayNoImmunizations() {
    return (
      <SummaryCard
        name={t("immunizations", "Immunizations")}
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-low-contrast)",
          border: "none",
          boxShadow: "none"
        }}
      >
        <div className={styles.immunizationMargin}>
          <p className="omrs-medium">No Immunizations are configured.</p>
          <p className="omrs-medium">
            <a href="/">Please configure Immunizations.</a>
          </p>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {allImmunizations && (
        <div className={styles.immunizationSummary}>
          {allImmunizations.length > 0
            ? displayImmunizations()
            : displayNoImmunizations()}
        </div>
      )}
    </>
  );
}

type ImmunizationsDetailedSummaryProps = {};
