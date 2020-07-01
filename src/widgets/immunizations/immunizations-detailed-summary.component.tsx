import React, { useEffect, useState } from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { createErrorHandler, reportError } from "@openmrs/esm-error-handling";
import { openmrsFetch, useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccinationRow";
import { useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";
import { find, get, map, orderBy } from "lodash-es";
import { mapFromFhirImmunizationSearchResults } from "./immunization-mapper";
import { getConfig } from "@openmrs/esm-module-config";

const rootConfigPath = "/frontend/spa-configs/";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [allImmunizations, setAllImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();
  getConfig("@openmrs/esm-patient-chart-widgets").then(immunizationConfig => {
    console.log(immunizationConfig);
  });

  function findMatchingImmunization(
    immunizationFromConfig,
    immunizationForPatient
  ) {
    return find(
      immunizationForPatient,
      patientImmunization =>
        //TODO: Change to UUIDs
        immunizationFromConfig.vaccineName === patientImmunization.vaccineName
    );
  }

  useEffect(() => {
    const getImmunizationWithExistingDoses = (config, immunizationForPatient) =>
      map(config.immunizations, configuredImmunization => {
        const matchingPatientImmunization = findMatchingImmunization(
          configuredImmunization,
          immunizationForPatient
        );
        if (!matchingPatientImmunization) return configuredImmunization;
        configuredImmunization.doses = matchingPatientImmunization.doses;
        return configuredImmunization;
      });

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
        .then(([config, searchResult]) => {
          let immunizationForPatient = mapFromFhirImmunizationSearchResults(
            searchResult
          );

          const consolidatedImmunizations = getImmunizationWithExistingDoses(
            config,
            immunizationForPatient
          );
          const sortedImmunizationsForPatient = orderBy(
            consolidatedImmunizations,
            [immunization => get(immunization, "doses.length", 0)],
            ["desc"]
          );
          setAllImmunizations(sortedImmunizationsForPatient);
        })
        .catch(createErrorHandler);

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient, patientUuid]);

  function displayImmunizations() {
    return (
      <SummaryCard
        name={t("Immunizations", "Immunizations")}
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
                return <VaccinationRow key={i} immunization={immunizations} />;
              })}
          </tbody>
        </table>
      </SummaryCard>
    );
  }

  function displayNoImmunizations() {
    return (
      <SummaryCard
        name={t("Immunizations", "Immunizations")}
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
        <div className={`${styles.immunizationSummary} immunizationSummary`}>
          {allImmunizations.length > 0
            ? displayImmunizations()
            : displayNoImmunizations()}
        </div>
      )}
    </>
  );
}

type ImmunizationsDetailedSummaryProps = {};
