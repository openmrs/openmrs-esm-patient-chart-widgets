import React, { useState, useEffect } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import styles from "./allergies-overview.css";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useRouteMatch } from "react-router-dom";

export default function AllergyOverview(props: AllergyOverviewProps) {
  const [patientAllergies, setPatientAllergies] = useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const allergiesPath = chartBasePath + "/" + props.basePath;

  useEffect(() => {
    if (patient) {
      const abortController = new AbortController();

      performPatientAllergySearch(patient.identifier[0].value, abortController)
        .then(allergy => setPatientAllergies(allergy.data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patient]);

  function displayAllergies() {
    return (
      <SummaryCard
        name="Allergies"
        styles={{ margin: "1.25rem, 1.5rem" }}
        link={`/patient/${patientUuid}/chart/allergies`}
      >
        {patientAllergies &&
          patientAllergies.total > 0 &&
          patientAllergies.entry.map(allergy => {
            return (
              <SummaryCardRow
                key={allergy.resource.id}
                linkTo={`${allergiesPath}/${allergy.resource.id}`}
              >
                <HorizontalLabelValue
                  label={allergy.resource.code.text}
                  labelClassName="omrs-bold"
                  labelStyles={{ flex: "1" }}
                  value={`${
                    allergy.resource.reaction[0].manifestation[0].text
                  } (${
                    allergy.resource.criticality === "?"
                      ? "\u2014"
                      : allergy.resource.criticality
                  })`}
                  valueStyles={{ flex: "1", paddingLeft: "1rem" }}
                  valueClassName={styles.allergyReaction}
                />
              </SummaryCardRow>
            );
          })}
      </SummaryCard>
    );
  }

  return (
    <>
      {patientAllergies && patientAllergies.total > 0 ? (
        displayAllergies()
      ) : (
        <SummaryCard name="Allergies">
          <div className={styles.emptyAllergies}>
            <p className="omrs-type-body-regular">No Allergies recorded.</p>
          </div>
        </SummaryCard>
      )}
    </>
  );
}

type AllergyOverviewProps = { basePath: string };
