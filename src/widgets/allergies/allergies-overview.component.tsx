import React, { useState, useEffect } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import styles from "./allergies-overview.css";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import AllergyForm from "./allergy-form.component";
import { openWorkspaceTab, capitalize } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import { useTranslation } from "react-i18next";

export default function AllergiesOverview(props: AllergiesOverviewProps) {
  const initialResultsBatch = 3;
  const [allPatientAllergies, setAllPatientAllergies] = useState(null);
  const [initialAllergiesBatch, setInitialAllergiesBatch] = useState([]);
  const [allergiesExpanded, setAllergiesExpanded] = useState(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const allergiesPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = performPatientAllergySearch(
        patient.identifier[0].value
      ).subscribe(allergies => {
        setAllPatientAllergies(allergies);
        setInitialAllergiesBatch(allergies.slice(0, initialResultsBatch));
      }, createErrorHandler());

      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient]);

  useEffect(() => {
    if (
      allPatientAllergies &&
      allPatientAllergies.length < initialResultsBatch
    ) {
      setAllergiesExpanded(true);
    }
  }, [allPatientAllergies]);

  const loadMoreAllergies = () => {
    setInitialAllergiesBatch(allPatientAllergies);
    setAllergiesExpanded(true);
  };

  return (
    <>
      {initialAllergiesBatch?.length > 0 ? (
        <SummaryCard
          name={t("Allergies")}
          styles={{ margin: "1.25rem, 1.5rem" }}
          link={`/patient/${patientUuid}/chart/allergies`}
          addComponent={AllergyForm}
          showComponent={() => {
            openWorkspaceTab(AllergyForm, "Allergies Form", {
              allergyUuid: null
            });
          }}
        >
          {initialAllergiesBatch.map(allergy => {
            const manifestations = allergy?.reactionManifestations?.join(", ");
            return (
              <SummaryCardRow
                key={allergy.id}
                linkTo={`${allergiesPath}/details/${allergy.id}`}
              >
                <HorizontalLabelValue
                  label={allergy.display}
                  labelClassName="omrs-medium"
                  labelStyles={{ flex: "1" }}
                  value={`${manifestations ? manifestations : ""} (${capitalize(
                    allergy?.reactionSeverity
                  )})`}
                  valueStyles={{ flex: "1", paddingLeft: "1rem" }}
                  valueClassName={styles.allergyReaction}
                />
              </SummaryCardRow>
            );
          })}
          {allergiesExpanded ? (
            <SummaryCardFooter linkTo={allergiesPath} />
          ) : (
            <div className={styles.allergiesFooter}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-medium-contrast)"
              >
                <use xlinkHref="#omrs-icon-chevron-down" />
              </svg>
              <button className="omrs-unstyled" onClick={loadMoreAllergies}>
                <p className="omrs-bold">More</p>
              </button>
            </div>
          )}
        </SummaryCard>
      ) : (
        <EmptyState
          showComponent={() => openWorkspaceTab(AllergyForm, "Allergies Form")}
          addComponent={AllergyForm}
          name={t("Allergies")}
          displayText={t("allergy intolerances")}
        />
      )}
    </>
  );
}

type AllergiesOverviewProps = { basePath: string };
