import React, { useState, useEffect } from "react";
import styles from "./edit-visit.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import dayjs from "dayjs";
import { DataCaptureComponentProps } from "../shared-utils";
import { getPatientVisits } from "./visit-resource";
import { getStartedVisit, visitMode, visitStatus } from "./visit-utils";
import { useTranslation } from "react-i18next";
import { OpenmrsResource } from "../../types/openmrs-resource";

export default function EditVisit(props: EditVisitProps) {
  const [patientVisits, setPatientVisits] = useState<PatientVisitType[]>([]);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      getPatientVisits(patientUuid, abortController).then(({ data }) => {
        setPatientVisits(data.results);
      }, createErrorHandler());
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
            <td>{t("visit start date", "Visit Start Date")}</td>
            <td>{t("visit type", "Visit Type")}</td>
            <td>{t("location", "Location")}</td>
            <td colSpan={3}>{t("visit end date", "Visit End Date")}</td>
          </tr>
        </thead>
        <tbody>
          {patientVisits &&
            patientVisits.map(visit => {
              return (
                <tr key={visit.uuid}>
                  <td>{formatVisitDate(visit.startDatetime)}</td>
                  <td>{visit.visitType.display}</td>
                  <td>{visit?.location?.display}</td>
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
                          mode: visitMode.EDITVISI,
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

type PatientVisitType = {
  encounters: Array<OpenmrsResource>;
  location?: OpenmrsResource;
  startDatetime: Date;
  stopDatetime: Date;
  uuid: string;
  visitType: { display: string; uuid: string };
};
