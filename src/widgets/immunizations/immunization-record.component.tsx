import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { getImmunizationByUuid } from "./immunizations.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import styles from "./immunization-record.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { ImmunizationsForm } from "./immunizations-form.component";
import { openWorkspaceTab } from "../shared-utils";
import RecordDetails from "../../ui-components/cards/record-details-card.component";

export default function ImmunizationRecord(props: ImmunizationRecordProps) {
  const [patientImmunization, setPatientImmunization] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = getImmunizationByUuid(
        match.params["immunizationUuid"]
      ).subscribe(
        ({ resource }) => setPatientImmunization(resource),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient, match.params]);

  return (
    <>
      {!!(
        patientImmunization && Object.entries(patientImmunization).length
      ) && (
        <div className={styles.immunizationContainer}>
          <SummaryCard
            name="Immunization"
            styles={{ width: "100%" }}
            editComponent={ImmunizationsForm}
            showComponent={() => {
              openWorkspaceTab(ImmunizationsForm, "Edit Immunizations", {
                immunizationUuid: patientImmunization?.id,
                immunizationName: patientImmunization?.code?.text,
                manufacturer: patientImmunization?.manufacturer?.reference,
                expirationDate: patientImmunization?.expirationDate,
                vaccinationDate: patientImmunization?.occurrenceDateTime
              });
            }}
          >
            <div
              className={`omrs-type-body-regular ${styles.immunizationCard}`}
            >
              <div>
                <p className="omrs-type-title-3">
                  {patientImmunization?.code?.text}
                </p>
              </div>
              <table className={styles.immunizationTable}>
                <thead>
                  <tr>
                    <td>Vaccine</td>
                    <td>Recent Vaccination</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {dayjs(patientImmunization?.code?.text).format(
                        "MMM-YYYY"
                      )}
                    </td>
                    <td>
                      {capitalize(patientImmunization?.occurrenceDateTime)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SummaryCard>
          <RecordDetails>
            <table className={styles.immunizationTable}>
              <thead>
                <tr>
                  <td>Series</td>
                  <td>Vaccination Date</td>
                  <td>Expiration</td>
                </tr>
              </thead>
              <tbody>
                {patientImmunization?.protocolApplied.map(protocolApplied => (
                  <tr>
                    <td> {protocolApplied.series} </td>
                    <td>
                      {dayjs(protocolApplied.occurrenceDateTime).format(
                        "DD-MMM-YYYY"
                      )}
                    </td>
                    <td>
                      {dayjs(protocolApplied.expirationDate).format(
                        "DD-MMM-YYYY"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RecordDetails>
        </div>
      )}
    </>
  );
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

type ImmunizationRecordProps = {};
