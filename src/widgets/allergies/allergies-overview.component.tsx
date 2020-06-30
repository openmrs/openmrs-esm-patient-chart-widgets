import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import style from "./allergies-overview.css";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import AllergyForm from "./allergy-form.component";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import { useTranslation } from "react-i18next";

export default function AllergiesOverview(props: AllergiesOverviewProps) {
  const [patientAllergies, setPatientAllergies] = React.useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const allergiesPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patient) {
      const abortController = new AbortController();

      performPatientAllergySearch(patient.identifier[0].value, abortController)
        .then(allergies => setPatientAllergies(allergies.data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patient]);

  return (
    <>
      {patientAllergies?.total > 0 ? (
        <SummaryCard
          name={t("Allergies")}
          styles={{ margin: "1.25rem, 1.5rem" }}
          link={`/patient/${patientUuid}/chart/allergies`}
          addComponent={AllergyForm}
          showComponent={() => {
            openWorkspaceTab(AllergyForm, `${t("Allergy Form")}`, {
              allergyUuid: null
            });
          }}
        >
          {patientAllergies.entry.map(allergy => {
            return (
              <SummaryCardRow
                key={allergy.resource.id}
                linkTo={`${allergiesPath}/details/${allergy.resource.id}`}
              >
                <HorizontalLabelValue
                  label={allergy.resource.code.text}
                  labelClassName="omrs-bold"
                  labelStyles={{ flex: "1" }}
                  value={`${
                    allergy?.resource?.reaction[0]?.manifestation[0]?.text
                  } (${
                    allergy?.resource?.criticality === "?"
                      ? "\u2014"
                      : allergy?.resource?.criticality
                  })`}
                  valueStyles={{ flex: "1", paddingLeft: "1rem" }}
                  valueClassName={style.allergyReaction}
                />
              </SummaryCardRow>
            );
          })}
        </SummaryCard>
      ) : (
        <EmptyState
          showComponent={() =>
            openWorkspaceTab(AllergyForm, `${t("Allergy Form")}`)
          }
          addComponent={AllergyForm}
          name={t("Allergies")}
          displayText={t("allergy intolerances")}
        />
      )}
    </>
  );
}

type AllergiesOverviewProps = { basePath: string };
