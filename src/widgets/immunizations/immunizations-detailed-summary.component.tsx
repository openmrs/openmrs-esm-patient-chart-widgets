import React, { useEffect, useState } from "react";
import {
  getImmunizationsConceptSet,
  performPatientImmunizationsSearch
} from "./immunizations.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccination-row.component";
import { Trans, useTranslation } from "react-i18next";
import styles from "./immunizations-detailed-summary.css";
import { find, get, map, orderBy } from "lodash-es";
import { mapFromFHIRImmunizationBundle } from "./immunization-mapper";
import {
  ImmunizationData,
  ImmunizationSequenceDefinition,
  ImmunizationWidgetConfigObject,
  OpenmrsConcept
} from "./immunization-domain";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [allImmunizations, setAllImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  function findConfiguredSequences(
    configuredSequences: Array<ImmunizationSequenceDefinition>
  ) {
    return (
      immunizationsConceptSet: OpenmrsConcept
    ): Array<ImmunizationData> => {
      const immunizationConcepts: Array<OpenmrsConcept> =
        immunizationsConceptSet?.setMembers;
      return map(immunizationConcepts, immunizationConcept => {
        const immunizationDataFromConfig: ImmunizationData = {
          vaccineName: immunizationConcept.display,
          vaccineUuid: immunizationConcept.uuid,
          existingDoses: []
        };

        const matchingSequenceDef = find(
          configuredSequences,
          sequencesDef =>
            sequencesDef.vaccineConceptUuid === immunizationConcept.uuid
        );
        immunizationDataFromConfig.sequences = matchingSequenceDef?.sequences;
        return immunizationDataFromConfig;
      });
    };
  }

  const findExistingDoses = function(
    configuredImmunizations: Array<ImmunizationData>,
    existingImmunizationsForPatient: Array<ImmunizationData>
  ): Array<ImmunizationData> {
    return map(configuredImmunizations, immunizationFromConfig => {
      const matchingExistingImmunization = find(
        existingImmunizationsForPatient,
        existingImmunization =>
          existingImmunization.vaccineUuid ===
          immunizationFromConfig.vaccineUuid
      );
      if (matchingExistingImmunization) {
        immunizationFromConfig.existingDoses =
          matchingExistingImmunization.existingDoses;
      }
      return immunizationFromConfig;
    });
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (!isLoadingPatient && patient) {
      const immunizationsConfig = props.immunizationsConfig;
      const searchTerm = immunizationsConfig?.vaccinesConceptSet;
      const configuredImmunizations: Promise<Array<
        ImmunizationData
      >> = getImmunizationsConceptSet(searchTerm, abortController).then(
        findConfiguredSequences(immunizationsConfig?.sequenceDefinitions)
      );

      const existingImmunizationsForPatient: Promise<Array<
        ImmunizationData
      >> = performPatientImmunizationsSearch(
        patient.identifier[0].value,
        patientUuid,
        abortController
      ).then(mapFromFHIRImmunizationBundle);

      const consolidatedImmunizations: Promise<Array<
        ImmunizationData
      >> = Promise.all([
        configuredImmunizations,
        existingImmunizationsForPatient
      ]).then(([configuredImmunizations, existingImmunizationsForPatient]) =>
        findExistingDoses(
          configuredImmunizations,
          existingImmunizationsForPatient
        )
      );

      consolidatedImmunizations
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
        className={styles.immunizationDetailedSummaryCard}
      >
        <table className={`omrs-type-body-regular ${styles.immunizationTable}`}>
          <thead>
            <tr>
              <td>{t("Vaccine", "Vaccine")}</td>
              <td>{t("Recent Vaccination", "Recent Vaccination")}</td>
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
          <p className="omrs-medium">
            <Trans i18nKey="No immunizations are configured">
              No immunizations are configured.
            </Trans>
          </p>
          <p className="omrs-medium">
            <a href="https://github.com/openmrs/openmrs-esm-patient-chart-widgets#configuration">
              <Trans i18nKey="Please configure immunizations">
                Please configure immunizations.
              </Trans>
            </a>
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
