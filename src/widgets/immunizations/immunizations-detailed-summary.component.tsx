import React, { useState, useEffect } from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccinationRow";
import { useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [patientImmunizations, setPatientImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const abortController = new AbortController();

      performPatientImmunizationsSearch(
        patient.identifier[0].value,
        abortController
      )
        .then(immunizations => setPatientImmunizations(immunizations))
        .catch(createErrorHandler());

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
            {patientImmunizations &&
              patientImmunizations.entry.map(immunizations => {
                return (
                  <VaccinationRow immunization={immunizations}></VaccinationRow>
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
          <p className="omrs-medium">No Immunizations are documented.</p>
          <p className="omrs-medium">
            Please <a href="/">add patient Immunizations.</a>
          </p>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {patientImmunizations && (
        <div className={styles.immunizationSummary}>
          {patientImmunizations.total > 0
            ? displayImmunizations()
            : displayNoImmunizations()}
        </div>
      )}
    </>
  );
}

type ImmunizationsDetailedSummaryProps = {};
