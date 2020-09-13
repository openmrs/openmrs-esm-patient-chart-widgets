import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { openWorkspaceTab } from "../shared-utils";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
import { Allergy, fetchAllergyByUuid } from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import styles from "./allergy-record.css";

export default function AllergyRecord(props: AllergyRecordProps) {
  const [allergy, setAllergy] = useState<Allergy>(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
  const { t } = useTranslation();

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
      {allergy && Object.entries(allergy).length && (
        <div className={styles.allergyContainer}>
          <SummaryCard
            name={t("Allergy", "Allergy")}
            styles={{ width: "100%" }}
            editComponent={AllergyForm}
            showComponent={() =>
              openWorkspaceTab(
                AllergyForm,
                `${t("Edit Allergy", "Edit Allergy")}`,
                {
                  allergyUuid: allergy.id
                }
              )
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
                <span>{allergy.display}</span>
              </div>
              <table className={styles.allergyTable}>
                <thead className="omrs-type-body-regular">
                  <tr>
                    <th>{t("Severity", "Severity")}</th>
                    <th>{t("Reaction", "Reaction")}</th>
                    <th>{t("Onset Date", "Onset Date")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div
                        className={`${styles.centerItems} ${
                          styles.reactionSeverity
                        } ${
                          allergy.reactionSeverity === Severity.Severe
                            ? `omrs-bold`
                            : ``
                        }`}
                      >
                        {allergy.reactionSeverity === Severity.Severe && (
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
                    <td>{allergy.reactionManifestations?.join(", ") || ""}</td>
                    <td>
                      {allergy.recordedDate
                        ? dayjs(allergy.recordedDate).format("MMM-YYYY")
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {allergy?.note && (
                <table className={styles.allergyTable}>
                  <thead className="omrs-type-body-regular">
                    <tr>
                      <th>{t("Comments", "Comments")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{allergy.note}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              <div className={styles.allergyFooter}></div>
            </div>
          </SummaryCard>
          <RecordDetails>
            <table className={styles.allergyTable}>
              <thead className="omrs-type-body-regular">
                <tr>
                  <th>{t("Last updated", "Last updated")}</th>
                  <th>{t("Last updated by", "Last updated by")}</th>
                  <th>{t("Last updated location", "Last updated location")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: "Work Sans" }}>
                    {allergy.lastUpdated
                      ? dayjs(allergy.lastUpdated).format("DD-MMM-YYYY")
                      : "-"}
                  </td>
                  <td>{allergy.recordedBy}</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
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
