import React, { useEffect, useState } from "react";
import {
  getVaccinesConceptSet,
  performPatientImmunizationsSearch
} from "./immunizations.resource";
import { createErrorHandler, reportError } from "@openmrs/esm-error-handling";
import { openmrsFetch, useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccinationRow";
import { useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";
import { find, forEach, get, map, orderBy } from "lodash-es";
import { mapFromFhirImmunizationSearchResults } from "./immunization-mapper";
import { getConfig } from "@openmrs/esm-module-config";

const rootConfigPath = "/frontend/spa-configs/";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [allImmunizations, setAllImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  useEffect(() => {
    const abortController = new AbortController();

    const configuredImmunizationsPromise = getConfig(
      "@openmrs/esm-patient-chart-widgets"
    )
      .then(configData => {
        const immunizationsConfig = configData?.immunizationsConfig;
        return getVaccinesConceptSet(
          immunizationsConfig?.vaccinesConceptSet,
          abortController
        ).then(vaccinesConceptSet => {
          const configuredImmunizations = vaccinesConceptSet?.setMembers;
          return map(configuredImmunizations, immunization => {
            const matchingSequenceDef = find(
              immunizationsConfig.sequencesDefinition,
              sequencesDef =>
                sequencesDef.vaccineConceptUuid === immunization.uuid
            );
            immunization.sequences = matchingSequenceDef?.sequences;
            return immunization;
          });
        });
      })
      .catch(error => {
        setAllImmunizations([]);
        reportError(error);
      });

    if (!isLoadingPatient && patient) {
      const existingImmunizationsForPatientPromise = performPatientImmunizationsSearch(
        patient.identifier[0].value,
        patientUuid,
        abortController
      ).then(mapFromFhirImmunizationSearchResults);

      const consolidatedImmunizationsPromise = Promise.all([
        configuredImmunizationsPromise,
        existingImmunizationsForPatientPromise
      ]).then(([configuredImmunizations, existingImmunizations]) => {
        return map(configuredImmunizations, immunizationFromConfig => {
          const consolidatedImmunization = {
            vaccineName: immunizationFromConfig.display,
            vaccineUuid: immunizationFromConfig.uuid,
            sequences: immunizationFromConfig.sequences,
            doses: []
          };
          const matchingExistingImmunization = find(
            existingImmunizations,
            existingImmunization => {
              return (
                existingImmunization.vaccineUuid === immunizationFromConfig.uuid
              );
            }
          );
          if (matchingExistingImmunization) {
            consolidatedImmunization.doses = matchingExistingImmunization.doses;
          }
          return consolidatedImmunization;
        });
      });
      consolidatedImmunizationsPromise.then(consolidatedImmunizations => {
        const sortedImmunizationsForPatient = orderBy(
          consolidatedImmunizations,
          [immunization => get(immunization, "doses.length", 0)],
          ["desc"]
        );
        setAllImmunizations(sortedImmunizationsForPatient);
      });

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
