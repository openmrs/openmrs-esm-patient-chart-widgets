import React, { useState, useEffect } from "react";
import { match, useRouteMatch, Link } from "react-router-dom";
import { performPatientConditionsSearch } from "./conditions.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import styles from "./conditions-detailed-summary.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { ConditionsForm } from "./conditions-form.component";
import dayjs from "dayjs";
import { openWorkspaceTab } from "../shared-utils";

export default function ConditionsDetailedSummary(
  props: ConditionsDetailedSummaryProps
) {
  const [patientConditions, setPatientConditions] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
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

  function displayConditions() {
    return (
      <SummaryCard
        name="Conditions"
        styles={{ width: "100%" }}
        addComponent={ConditionsForm}
        showComponent={() =>
          openWorkspaceTab(ConditionsForm, "Conditions Form")
        }
      >
        <table className={`omrs-type-body-regular ${styles.conditionTable}`}>
          <thead>
            <tr>
              <td>CONDITION</td>
              <td>ONSET DATE</td>
              <td>STATUS</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {patientConditions &&
              patientConditions.entry
                .sort((a, b) =>
                  a.resource.clinicalStatus > b.resource.clinicalStatus ? 1 : -1
                )
                .map(condition => {
                  return (
                    <React.Fragment key={condition.resource.id}>
                      <tr
                        className={`${
                          condition.resource.clinicalStatus === "active"
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
    );
  }

  function displayNoConditions() {
    return (
      <SummaryCard
        name="Conditions"
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-low-contrast)",
          border: "none",
          boxShadow: "none"
        }}
      >
        <div className={styles.conditionMargin}>
          <p className="omrs-medium">No Conditions are documented.</p>
          <p className="omrs-medium">
            Please <a href="/">add patient condition.</a>
          </p>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {patientConditions && (
        <div className={styles.conditionSummary}>
          {patientConditions.total > 0
            ? displayConditions()
            : displayNoConditions()}
        </div>
      )}
    </>
  );
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

type ConditionsDetailedSummaryProps = {};
