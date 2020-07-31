import React, { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import dayjs from "dayjs";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import {
  performPatientAllergySearch,
  Allergy
} from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import styles from "./allergies-detailed-summary.css";

export default function AllergiesDetailedSummary(
  props: AllergiesDetailedSummaryProps
) {
  const [patientAllergies, setPatientAllergies] = useState<Allergy[]>(null);
  const [isLoadingPatient, patient] = useCurrentPatient();
  const match = useRouteMatch();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = performPatientAllergySearch(
        patient.identifier[0].value
      ).subscribe(allergies => {
        setPatientAllergies(allergies);
      }, createErrorHandler());

      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient]);

  return (
    <>
      {patientAllergies?.length ? (
        <SummaryCard
          name="Allergies"
          styles={{ width: "100%" }}
          addComponent={AllergyForm}
          showComponent={() =>
            openWorkspaceTab(AllergyForm, "Allergies Form", {
              allergyUuid: null
            })
          }
        >
          <table className={`omrs-type-body-regular ${styles.allergyTable}`}>
            <thead>
              <tr>
                <td>ALLERGEN</td>
                <td>
                  <div className={styles.centerItems}>
                    SEVERITY & REACTION
                    <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                      <use xlinkHref="#omrs-icon-arrow-downward" />
                    </svg>
                  </div>
                </td>
                <td>SINCE</td>
                <td>UPDATED</td>
              </tr>
            </thead>
            <tbody>
              {patientAllergies.map(allergy => {
                return (
                  <React.Fragment key={allergy?.id}>
                    <tr
                      className={`${
                        allergy?.criticality === "high"
                          ? `${styles.high}`
                          : `${styles.low}`
                      }`}
                    >
                      <td className="omrs-medium">{allergy?.display}</td>
                      <td>
                        <div
                          className={`${styles.centerItems} ${
                            styles.allergySeverity
                          } ${
                            allergy?.criticality === "high" ? `omrs-bold` : ``
                          }`}
                          style={{ textTransform: "uppercase" }}
                        >
                          {allergy?.criticality === "high" && (
                            <svg
                              className="omrs-icon omrs-margin-right-4"
                              fill="rgba(181, 7, 6, 1)"
                              style={{ height: "1.833rem" }}
                            >
                              <use xlinkHref="#omrs-icon-important-notification" />
                            </svg>
                          )}
                          {allergy?.criticality}
                        </div>
                      </td>
                      <td>
                        {dayjs(allergy?.recordedDate).format("MMM-YYYY") ?? "-"}
                      </td>
                      <td>
                        <div
                          className={`${styles.centerItems} ${styles.alignRight}`}
                        >
                          <span>
                            {dayjs(allergy?.lastUpdated).format("DD-MMM-YYYY")}
                          </span>
                          <Link to={`${match.path}/details/${allergy?.id}`}>
                            <svg
                              className="omrs-icon"
                              fill="rgba(0, 0, 0, 0.54)"
                            >
                              <use xlinkHref="#omrs-icon-chevron-right" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td style={{ textAlign: "left" }}>
                        {allergy?.reactionManifestations?.join(", ")}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan={3}>
                        <span className={styles.allergyComment}>
                          <span style={{ textAlign: "left" }}>
                            {allergy?.note}
                          </span>
                        </span>
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
          name="Allergies"
          showComponent={() =>
            openWorkspaceTab(AllergyForm, "Allergies Form", {
              allergyUuid: null
            })
          }
          addComponent={AllergyForm}
          displayText="allergy intolerances"
        />
      )}
    </>
  );
}

type AllergiesDetailedSummaryProps = {};
