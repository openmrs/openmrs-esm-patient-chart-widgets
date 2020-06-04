import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { fetchAllergyByUuid } from "./allergy-intolerance.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import styles from "./allergy-record.css";
import dayjs from "dayjs";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import AllergyForm from "./allergy-form.component";
import { openWorkspaceTab } from "../shared-utils";
import RecordDetails from "../../ui-components/cards/record-details-card.component";

export default function AllergyRecord(props: AllergyRecordProps) {
  const [allergy, setAllergy] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();

  let match: any = useRouteMatch();

  useEffect(() => {
    if (!isLoadingPatient && patient && match.params["allergyUuid"]) {
      const sub = fetchAllergyByUuid(match.params["allergyUuid"]).subscribe(
        allergy => setAllergy(allergy),
        createErrorHandler()
      );

      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, match.params]);

  return (
    <>
      {!!(allergy && Object.entries(allergy).length) && (
        <div className={styles.allergyContainer}>
          <SummaryCard
            name="Allergy"
            styles={{ width: "100%" }}
            editComponent={AllergyForm}
            showComponent={() =>
              openWorkspaceTab(AllergyForm, "Edit Allergy", {
                allergyUuid: allergy.id
              })
            }
            link={`/patient/${patientUuid}/chart/allergies`}
          >
            <div
              className={`omrs-type-body-regular ${styles.allergyCard} ${
                allergy.reactionSeverity === "Severe"
                  ? `${styles.highSeverity}`
                  : `${styles.lowSeverity}`
              }`}
            >
              <div className={`omrs-type-title-3 ${styles.allergyName}`}>
                <span>{allergy?.display}</span>
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
                    <td>
                      <div
                        className={`${styles.centerItems} ${
                          styles.reactionSeverity
                        } ${
                          allergy?.reactionSeverity === Severity.Severe
                            ? `omrs-bold`
                            : ``
                        }`}
                      >
                        {allergy?.reactionSeverity === Severity.Severe && (
                          <svg
                            className="omrs-icon"
                            fill="var(--omrs-color-danger)"
                          >
                            <use xlinkHref="#omrs-icon-important-notification" />
                          </svg>
                        )}
                        {allergy.reactionSeverity}
                      </div>
                    </td>
                    <td>
                      {allergy?.reactionManifestations
                        ? allergy?.reactionManifestations?.join(", ")
                        : ""}
                    </td>
                    <td>
                      {allergy?.recordedDate
                        ? dayjs(allergy?.recordedDate).format("MMM-YYYY")
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {allergy?.note && (
                <table className={styles.allergyTable}>
                  <thead className="omrs-type-body-regular">
                    <tr>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{allergy?.note}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              <div className={styles.allergyFooter}></div>
            </div>
          </SummaryCard>
          <RecordDetails>
            <div className={styles.allergyCard}>
              <table
                className={`${styles.allergyTable} ${styles.allergyDetails}`}
              >
                <thead className="omrs-type-body-regular">
                  <tr>
                    <th>Last updated</th>
                    <th>Last updated by</th>
                    <th>Last updated location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {allergy?.lastUpdated
                        ? dayjs(allergy?.lastUpdated).format("DD-MMM-YYYY")
                        : "-"}
                    </td>
                    <td>{allergy?.recordedBy}</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </RecordDetails>
        </div>
      )}
    </>
  );
}

type AllergyRecordProps = {};

enum Severity {
  Severe = "Severe",
  Mild = "Mild",
  Moderate = "Moderate"
}
