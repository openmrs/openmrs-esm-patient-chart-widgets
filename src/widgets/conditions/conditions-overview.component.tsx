import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import { ConditionsForm } from "./conditions-form.component";
import {
  Condition,
  performPatientConditionsSearch
} from "./conditions.resource";
import styles from "./conditions-overview.css";

export default function ConditionsOverview(props: ConditionsOverviewProps) {
  const initialConditionsBatchCount = 5;
  const [conditionsExpanded, setConditionsExpanded] = useState(false);
  const [patientConditions, setPatientConditions] = useState<Condition[]>(null);
  const [initialConditionsBatch, setInitialConditionsBatch] = useState<
    Condition[]
  >([]);
  const [, patient] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const conditionsPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  useEffect(() => {
    if (patient) {
      const sub = performPatientConditionsSearch(
        patient.identifier[0].value
      ).subscribe(conditions => {
        setPatientConditions(conditions);
        setInitialConditionsBatch(
          conditions.slice(0, initialConditionsBatchCount)
        );
      }, createErrorHandler());

      return () => sub.unsubscribe();
    }
  }, [patient]);

  useEffect(() => {
    if (patientConditions?.length <= initialConditionsBatchCount) {
      setConditionsExpanded(true);
    }
  }, [patientConditions]);

  const showMoreConditions = () => {
    setInitialConditionsBatch(patientConditions);
    setConditionsExpanded(true);
  };

  return (
    <>
      {initialConditionsBatch?.length > 0 ? (
        <SummaryCard
          name={t("conditions", "Conditions")}
          styles={{ margin: "1.25rem, 1.5rem" }}
          link={conditionsPath}
          addComponent={ConditionsForm}
          showComponent={() =>
            openWorkspaceTab(
              ConditionsForm,
              `${t("conditionsForm", "Conditions Form")}`
            )
          }
        >
          <SummaryCardRow>
            <SummaryCardRowContent>
              <HorizontalLabelValue
                label={t("activeConditions", "Active Conditions")}
                labelStyles={{
                  color: "var(--omrs-color-ink-medium-contrast)",
                  fontFamily: "Work Sans"
                }}
                value={t("since", "Since")}
                valueStyles={{
                  color: "var(--omrs-color-ink-medium-contrast)",
                  fontFamily: "Work Sans"
                }}
              />
            </SummaryCardRowContent>
          </SummaryCardRow>
          {initialConditionsBatch.map(condition => {
            return (
              <SummaryCardRow
                key={condition.id}
                linkTo={`${conditionsPath}/${condition.id}`}
              >
                <HorizontalLabelValue
                  label={condition.display}
                  labelStyles={{ fontWeight: 500 }}
                  value={dayjs(condition?.onsetDateTime).format("MMM-YYYY")}
                  valueStyles={{ fontFamily: "Work Sans" }}
                />
              </SummaryCardRow>
            );
          })}
          {conditionsExpanded ? (
            <SummaryCardFooter linkTo={conditionsPath} />
          ) : (
            <div className={styles.conditionsFooter}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-medium-contrast)"
              >
                <use xlinkHref="#omrs-icon-chevron-down" />
              </svg>
              <button className="omrs-unstyled" onClick={showMoreConditions}>
                <p className="omrs-bold">{t("more", "More")}</p>
              </button>
            </div>
          )}
        </SummaryCard>
      ) : (
        <EmptyState
          name={t("conditions", "Conditions")}
          showComponent={() =>
            openWorkspaceTab(
              ConditionsForm,
              `${t("conditionsForm", "Conditions Form")}`
            )
          }
          addComponent={ConditionsForm}
          displayText={t("conditions", "conditions")}
        />
      )}
    </>
  );
}

type ConditionsOverviewProps = {
  basePath: string;
};
