import React, { useState, useEffect } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useRouteMatch } from "react-router-dom";
import {
  performPatientsVitalsSearch,
  PatientVitals
} from "./vitals-card.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import styles from "./vital-record.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import dayjs from "dayjs";
import VitalsForm from "./vitals-form.component";
import { openWorkspaceTab } from "../shared-utils";
import { useTranslation } from "react-i18next";

export default function VitalRecord(props: VitalRecordProps) {
  const [vitalSigns, setVitalSigns] = useState<PatientVitals>(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patientUuid && match.params) {
      const sub = performPatientsVitalsSearch(patientUuid).subscribe(
        vitals =>
          setVitalSigns(
            vitals.find(vital => vital.id === match.params["vitalUuid"])
          ),
        createErrorHandler()
      );
      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patientUuid, match.params]);

  return (
    <>
      {vitalSigns && (
        <SummaryCard
          name={t("Vital", "Vital")}
          styles={{ width: "100%" }}
          editComponent={VitalsForm}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, t("editVitals", "Edit Vitals"), {
              vitalUuid: match.params["vitalUuid"]
            })
          }
        >
          <div className={`omrs-type-body-regular ${styles.vitalCard}`}>
            <table className={styles.vitalTable}>
              <tbody>
                <tr>
                  <td className={styles.label}>Measured at</td>
                  <td className={styles.value}>
                    {vitalSigns.date
                      ? dayjs(vitalSigns.date).format("DD-MMM-YYYY hh:mm A")
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>Blood pressure</td>
                  <td className={styles.value}>
                    {vitalSigns.systolic} / {vitalSigns.diastolic}{" "}
                    <span>mmHg</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>Heart rate</td>
                  <td className={styles.value}>
                    {vitalSigns.pulse} <span>bpm</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>Oxygen saturation</td>
                  <td className={styles.value}>
                    {vitalSigns.oxygenation} <span>%</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>Temperature</td>
                  <td className={styles.value}>
                    {vitalSigns.temperature} <span>°C</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SummaryCard>
      )}
    </>
  );
}

type VitalRecordProps = {};
