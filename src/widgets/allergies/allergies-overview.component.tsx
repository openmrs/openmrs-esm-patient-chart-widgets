import React, { useState, useEffect } from "react";
import { capitalize } from "lodash-es";
import { useTranslation } from "react-i18next";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import {
  performPatientAllergySearch,
  Allergy
} from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import styles from "./allergies-overview.css";

export default function AllergiesOverview(props: AllergiesOverviewProps) {
  const initialAllergiesBatchCount = 3;
  const [allPatientAllergies, setAllPatientAllergies] = useState<Allergy[]>(
    null
  );
  const [initialAllergiesBatch, setInitialAllergiesBatch] = useState<Allergy[]>(
    []
  );
  const [allergiesExpanded, setAllergiesExpanded] = useState<boolean>(false);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const allergiesPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = performPatientAllergySearch(
        patient.identifier[0].value
      ).subscribe(allergies => {
        setAllPatientAllergies(allergies);
        setInitialAllergiesBatch(
          allergies.slice(0, initialAllergiesBatchCount)
        );
      }, createErrorHandler());

      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient]);

  useEffect(() => {
    if (allPatientAllergies?.length <= initialAllergiesBatchCount) {
      setAllergiesExpanded(true);
    }
  }, [allPatientAllergies]);

  const showMoreAllergies = () => {
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
            const manifestations =
              allergy.reactionManifestations?.join(", ") || "";
            return (
              <SummaryCardRow
                key={allergy.id}
                linkTo={`${allergiesPath}/details/${allergy.id}`}
              >
                <HorizontalLabelValue
                  label={allergy.display}
                  labelClassName="omrs-medium"
                  labelStyles={{ flex: "1" }}
                  value={`${manifestations} (${capitalize(
                    allergy.reactionSeverity
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
              <button className="omrs-unstyled" onClick={showMoreAllergies}>
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
