import React, { useEffect, useState } from "react";
import {
  getImmunizationsConceptSet,
  performPatientImmunizationsSearch
} from "./immunizations.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccination-row.component";
import { useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";
import { find, get, map, orderBy } from "lodash-es";
import { mapFromFHIRImmunizationBundle } from "./immunization-mapper";
import { ImmunizationWidgetConfigObject } from "./immunization-widget-config-schema";
import { ImmunizationData } from "./immunization-domain";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [allImmunizations, setAllImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  function mapImmunizationSequences(configuredSequences) {
    return immunizationsConceptSet => {
      const immunizationConcepts = immunizationsConceptSet?.setMembers;
      return map(immunizationConcepts, immunizationConcept => {
        const isSameImmunization = sequencesDef =>
          sequencesDef.vaccineConceptUuid === immunizationConcept.uuid;
        const matchingSequenceDef = find(
          configuredSequences,
          isSameImmunization
        );
        immunizationConcept.sequences = matchingSequenceDef?.sequences;
        return immunizationConcept;
      });
    };
  }

  const findExistingDosesForConfiguredImmunizations = function(
    configuredImmunizations,
    existingImmunizationsForPatient
  ): Array<ImmunizationData> {
    return map(configuredImmunizations, immunizationFromConfig => {
      const consolidatedImmunization: ImmunizationData = {
        vaccineName: immunizationFromConfig.display,
        vaccineUuid: immunizationFromConfig.uuid,
        sequences: immunizationFromConfig.sequences,
        existingDoses: []
      };
      const isSameImmunization = existingImmunization =>
        existingImmunization.vaccineUuid === immunizationFromConfig.uuid;
      const matchingExistingImmunization = find(
        existingImmunizationsForPatient,
        isSameImmunization
      );
      if (matchingExistingImmunization) {
        consolidatedImmunization.existingDoses =
          matchingExistingImmunization.existingDoses;
      }
      return consolidatedImmunization;
    });
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (!isLoadingPatient && patient) {
      const immunizationsConfig = props.immunizationsConfig;
      const searchTerm = immunizationsConfig?.vaccinesConceptSet;
      const configuredImmunizationsPromise = getImmunizationsConceptSet(
        searchTerm,
        abortController
      ).then(
        mapImmunizationSequences(immunizationsConfig?.sequencesDefinition)
      );

      const existingImmunizationsForPatientPromise = performPatientImmunizationsSearch(
        patient.identifier[0].value,
        patientUuid,
        abortController
      ).then(mapFromFHIRImmunizationBundle);

      const consolidatedImmunizationsPromise = Promise.all([
        configuredImmunizationsPromise,
        existingImmunizationsForPatientPromise
      ]).then(([configuredImmunizations, existingImmunizationsForPatient]) =>
        findExistingDosesForConfiguredImmunizations(
          configuredImmunizations,
          existingImmunizationsForPatient
        )
      );

      consolidatedImmunizationsPromise
        .then((consolidatedImmunizations: Array<ImmunizationData>) => {
          const sortedImmunizationsForPatient = orderBy(
            consolidatedImmunizations,
            [immunization => get(immunization, "existingDoses.length", 0)],
            ["desc"]
          );
          setAllImmunizations(sortedImmunizationsForPatient);
        })
        .catch(err => {
          if (err.name !== "AbortError") {
            setAllImmunizations([]);
            createErrorHandler();
          }
        });

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient, patientUuid, props]);

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

type ImmunizationsDetailedSummaryProps = {
  immunizationsConfig: ImmunizationWidgetConfigObject;
};
