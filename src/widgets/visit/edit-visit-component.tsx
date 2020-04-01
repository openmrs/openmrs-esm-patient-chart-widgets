import React, { useState, useEffect } from "react";
import styles from "./edit-visit.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import dayjs from "dayjs";
import { DataCaptureComponentProps } from "../shared-utils";
import { getPatientVisits } from "./visit-resource";
import { getStartedVisit, visitMode, visitStatus } from "./visit-utils";

export default function EditVisit(props: EditVisitProps) {
  const [patientVisits, setPatientVisits] = useState<any[]>([]);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();

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
            <td>Visit Start Date</td>
            <td>Visit Type</td>
            <td>Location</td>
            <td colSpan={3}>Visit End Date</td>
          </tr>
        </thead>
        <tbody>
          {patientVisits &&
            patientVisits.map(visit => {
              return (
                <tr key={visit.uuid}>
                  <td>{formatVisitDate(visit.startDatetime)}</td>
                  <td>{visit.visitType.display}</td>
                  <td>{visit.location.display}</td>
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
                      Edit
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
                      Load
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
          Cancel
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
