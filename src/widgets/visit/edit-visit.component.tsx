import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import styles from "./edit-visit.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { getStartedVisit, visitMode, visitStatus } from "./visit-utils";
import { getVisitsForPatient, Visit } from "./visit.resource";

export default function EditVisit(props: EditVisitProps) {
  const [patientVisits, setPatientVisits] = useState<Array<Visit>>([]);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      getVisitsForPatient(patientUuid, abortController).subscribe(
        ({ data }) => {
          setPatientVisits(data.results);
        },
        createErrorHandler()
      );
    }
  }, [patientUuid]);

  const formatVisitDate = (inputDate: any) => {
    return dayjs(inputDate).format("DD-MMM.YYYY");
  };

  return (
    <div className={styles.editVisitContainer}>
      <table className={styles.editVisitTable}>
        <thead>
          <tr>
            <td>{t("visitStartDate", "Visit Start Date")}</td>
            <td>{t("visitType", "Visit Type")}</td>
            <td>{t("location", "Location")}</td>
            <td colSpan={3}>{t("visitEndDate", "Visit End Date")}</td>
          </tr>
        </thead>
        <tbody>
          {patientVisits &&
            patientVisits.map(visit => {
              return (
                <tr key={visit.uuid}>
                  <td>{formatVisitDate(visit.startDatetime)}</td>
                  <td>{visit.visitType.display}</td>
                  <td>{visit.location?.display}</td>
                  <td>
                    {visit.stopDatetime
                      ? formatVisitDate(visit.stopDatetime)
                      : "\u2014"}
                  </td>
                  <td>
                    <button
                      style={{ cursor: "pointer" }}
                      className={`omrs-btn omrs-outlined-action`}
                      onClick={() => {
                        props.onVisitStarted();
                        getStartedVisit.next({
                          mode: visitMode.EDITVISIT,
                          visitData: visit,
                          status: visitStatus.ONGOING
                        });
                      }}
                    >
                      {t("edit", "Edit")}
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ cursor: "pointer" }}
                      className={`omrs-btn omrs-outlined-action`}
                      onClick={() => {
                        getStartedVisit.next({
                          mode: visitMode.LOADING,
                          visitData: visit,
                          status: visitStatus.ONGOING
                        });
                        props.closeComponent();
                      }}
                    >
                      {t("load", "Load")}
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className={styles.cancelButtonContainer}>
        <button
          style={{
            cursor: "pointer",
            width: "25%",
            borderRadius: "1.5rem"
          }}
          className={`omrs-btn omrs-outlined-action`}
          onClick={props.onCanceled}
        >
          {t("cancel", "Cancel")}
        </button>
      </div>
    </div>
  );
}

type EditVisitProps = {
  onVisitStarted(): void;
  onCanceled(): void;
  closeComponent(): void;
};
