import React, { useState, useEffect } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { performPatientConditionsSearch } from "./conditions.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import styles from "./conditions-detailed-summary.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { ConditionsForm } from "./conditions-form.component";
import dayjs from "dayjs";
import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { useTranslation, Trans } from "react-i18next";
import { capitalize } from "lodash-es";

export default function ConditionsDetailedSummary(
  props: ConditionsDetailedSummaryProps
) {
  const { t } = useTranslation();
  const match = useRouteMatch();
  const [patientConditions, setPatientConditions] = useState(null);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const path = `${match.url.replace(":subView", "details")}/details`;

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const abortController = new AbortController();

      performPatientConditionsSearch(
        patient.identifier[0].value,
        abortController
      )
        .then(conditions => setPatientConditions(conditions))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient]);

  return (
    <div className="styles.conditionSummary">
      {patientConditions?.total > 0 ? (
        <SummaryCard
          name={t("conditions", "Conditions")}
          styles={{ width: "100%" }}
          addComponent={ConditionsForm}
          showComponent={() =>
            openWorkspaceTab(
              ConditionsForm,
              `${t("conditionsForm", "Conditions Form")}`
            )
          }
        >
          <table className={`omrs-type-body-regular ${styles.conditionTable}`}>
            <thead>
              <tr>
                <td>
                  <Trans i18nKey="condition">Condition</Trans>
                </td>
                <td>
                  <Trans i18nKey="onsetDate">Onset date</Trans>
                </td>
                <td>
                  <Trans i18nKey="status">Status</Trans>
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {patientConditions?.entry
                .sort((a, b) =>
                  a?.resource?.clinicalStatus > b?.resource?.clinicalStatus
                    ? 1
                    : -1
                )
                .map(condition => {
                  return (
                    <React.Fragment key={condition.resource.id}>
                      <tr
                        className={`${
                          condition?.resource?.clinicalStatus === "active"
                            ? `${styles.active}`
                            : `${styles.inactive}`
                        }`}
                      >
                        <td className="omrs-medium">
                          {condition.resource.code.text}
                        </td>
                        <td>
                          <div className={`${styles.alignRight}`}>
                            {dayjs(condition.resource.onsetDateTime).format(
                              "MMM-YYYY"
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`${styles.centerItems} ${styles.alignLeft}`}
                          >
                            <span>
                              {capitalize(condition.resource.clinicalStatus)}
                            </span>
                          </div>
                        </td>
                        <td>
                          {
                            <Link to={`${path}/${condition.resource.id}`}>
                              <svg
                                className="omrs-icon"
                                fill="var(--omrs-color-ink-low-contrast)"
                              >
                                <use xlinkHref="#omrs-icon-chevron-right" />
                              </svg>
                            </Link>
                          }
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
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
    </div>
  );
}

type ConditionsDetailedSummaryProps = {};
