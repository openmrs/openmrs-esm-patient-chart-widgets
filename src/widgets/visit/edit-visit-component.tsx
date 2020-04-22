import React, { useState, useEffect } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import { getVisitsForPatient } from "./visit-resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import dayjs from "dayjs";
import styles from "./edit-visit.css";

export default function EditVisit() {
  const [patientVisits, setPatientVisits] = useState<any[]>();
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      getVisitsForPatient(patientUuid, abortController).subscribe(
        ({ data }) => setPatientVisits(data.results),
        createErrorHandler()
      );
      return () => abortController.abort();
    }
  }, [patientUuid]);

  return (
    <div className={`omrs-card ${styles.card}`}>
      <div>
        <div>
          <select name="visitType" id="visitType">
            <option value="1">InPatient Visit</option>
            <option value="2">Outpatient Visit</option>
            <option value="3">HIV Visit</option>
            <option value="4">CDM Care Visit</option>
          </select>
        </div>
        <div>
          <button>load</button>
          <button>Edit</button>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Visit Start Datetime</th>
              <th>Visit Type</th>
              <th>Location</th>
              <th>Visit End Datetime</th>
            </tr>
          </thead>
          <tbody>
            {patientVisits &&
              patientVisits.map(visit => {
                return (
                  <tr key={visit.uuid}>
                    <td>
                      <input
                        type="radio"
                        name="visit"
                        id={visit.uuid}
                        value={visit.uuid}
                      />
                    </td>
                    <td>
                      {dayjs(visit.startDatetime).format("YYYY-MM-DD hh:mm A")}
                    </td>
                    <td>{visit.visitType.name}</td>
                    <td>{visit.location?.display}</td>
                    <td>
                      {visit.stopDatetime
                        ? dayjs(visit.stopDatetime).format("YYYY-MM-DD hh:mm A")
                        : "\u2014"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div>
        <button className={`omrs-btn omrs-outlined-neutral`}>Cancel</button>
      </div>
    </div>
  );
}
