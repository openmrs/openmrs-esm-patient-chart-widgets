import React, { useState, useEffect } from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { createErrorHandler, reportError } from "@openmrs/esm-error-handling";
import { useCurrentPatient, openmrsFetch } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccinationRow";
import { useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";
import { map, find, orderBy, get } from "lodash-es";

const rootConfigPath = "/frontend/spa-configs/";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [allImmunizations, setAllImmunizations] = useState([]);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  const mergeConfigAndSearchResult = ([config, searchResult]) => {
    const consolidatedImmunization = map(config.immunizations, immunization => {
      const matchingPatientImmunization = find(
        searchResult.entry,
        entry =>
          //TODO: Change to UUIDs
          immunization.vaccineName === entry?.resource?.vaccineCode?.text
      );
      if (!matchingPatientImmunization) {
        return immunization;
      }
      immunization.manufacturer =
        matchingPatientImmunization?.resource?.manufacturer;
      immunization.lotNumber = matchingPatientImmunization?.resource?.lotNumber;
      immunization.protocolApplied =
        matchingPatientImmunization?.resource?.protocolApplied;
      return immunization;
    });

    const sortedImmunizationForPatient = orderBy(
      consolidatedImmunization,
      [immunization => get(immunization, "protocolApplied.length", 0)],
      ["desc"]
    );
    setAllImmunizations(sortedImmunizationForPatient);
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
        abortController
      );

      Promise.all([configPromise, searchResultPromise])
        .then(mergeConfigAndSearchResult)
        .catch(createErrorHandler);

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient]);

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
