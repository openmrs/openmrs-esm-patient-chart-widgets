import React from "react";
import { useRouteMatch } from "react-router-dom";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { getPatientAllergyByPatientUuid } from "./allergy-intolerance.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import styles from "./allergy-record.css";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import AllergyForm from "./allergy-form.component";
import { openWorkspaceTab } from "../shared-utils";

export default function AllergyRecord(props: AllergyRecordProps) {
  const [allergy, setAllergy] = React.useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();

  let match = useRouteMatch();

  React.useEffect(() => {
    if (!isLoadingPatient && patient) {
      const abortController = new AbortController();

      getPatientAllergyByPatientUuid(
        patientUuid,
        { allergyUuid: match.params["allergyUuid"] },
        abortController
      )
        .then(allergy => setAllergy(allergy.data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient, patientUuid, match.params]);

  function displayAllergy() {
    return (
      <SummaryCard
        name="Allergy"
        styles={{ width: "100%" }}
        editComponent={AllergyForm}
        showComponent={() =>
          openWorkspaceTab(AllergyForm, "Edit Allergy", {
            allergyUuid: allergy.uuid
          })
        }
        link={`/patient/${patientUuid}/chart/allergies`}
      >
        <div
          className={`omrs-type-body-regular ${styles.allergyCard} ${
            allergy.severity.display === "Severe"
              ? `${styles.highSeverity}`
              : `${styles.lowSeverity}`
          }`}
        >
          <div className={`omrs-type-title-3 ${styles.allergyName}`}>
            <span data-testid="allergy-name">{allergy.display}</span>
          </div>
          <table className={styles.allergyTable}>
            <thead className="omrs-type-body-regular">
              <tr>
                <th>Severity</th>
                <th>Reaction</th>
                <th>Onset Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-testid="severity">
                  <div
                    className={`${styles.centerItems} ${
                      allergy.severity.display === "Severe" ? `omrs-bold` : ``
                    }`}
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      lineHeight: "1rem",
                      fontWeight: 500
                    }}
                  >
                    {allergy.severity.display === "Severe" && (
                      <svg
                        className={`omrs-icon`}
                        fontSize={"15px"}
                        fill="var(--omrs-color-danger)"
                      >
                        <use xlinkHref="#omrs-icon-important-notification" />
                      </svg>
                    )}
                    {allergy.severity.display}
                  </div>
                </td>
                <td data-testid="reaction">
                  {allergy.reactions
                    .map(rxn => rxn.reaction.display)
                    .join(", ")}
                </td>
                {/* Onset date is not yet available from the API response */}
                <td data-testid="onset-date">-</td>
              </tr>
            </tbody>
          </table>
          {allergy.comment && (
            <table className={styles.allergyTable}>
              <thead className="omrs-type-body-regular">
                <tr>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr data-testid="comment">
                  <td>{allergy.comment}</td>
                </tr>
              </tbody>
            </table>
          )}
          <div className={styles.allergyFooter}></div>
        </div>
      </SummaryCard>
    );
  }

  function displayDetails() {
    return (
      <SummaryCard
        name="Details"
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-medium-contrast)"
        }}
      >
        <div className={styles.allergyCard}>
          <table className={`${styles.allergyTable} ${styles.allergyDetails}`}>
            <thead className="omrs-type-body-regular">
              <tr>
                <th>Last updated</th>
                <th>Last updated by</th>
                <th>Last updated location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-testid="last-updated">
                  {allergy.auditInfo.dateChanged
                    ? dayjs(allergy.auditInfo.dateChanged).format("DD-MMM-YYYY")
                    : "-"}
                </td>
                <td data-testid="updated-by">
                  {allergy.auditInfo.creator.display}
                </td>
                <td data-testid="update-location">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {allergy && (
        <div className={styles.allergySummary}>{displayAllergy()}</div>
      )}
      {allergy && (
        <div className={styles.allergySummary}>{displayDetails()}</div>
      )}
    </>
  );
}

type AllergyRecordProps = {};
