import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styles from "./immunizations-detailed-summary.css";
import vaccinationRowStyles from "./vaccination-row.css";
import { ImmunizationsForm } from "./immunizations-form.component";
import dayjs from "dayjs";
import { openWorkspaceTab } from "../shared-utils";
import { useTranslation } from "react-i18next";
import { ImmunizationData } from "./immunization-domain";

export default function VaccinationRow(params: ImmunizationProps) {
  const [patientImmunization, setPatientImmunization] = useState(null);
  const [toggleOpen, setToggleOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setPatientImmunization(params.immunization);
  }, [params]);
  const match = useRouteMatch();

  return (
    patientImmunization && (
      <React.Fragment key={patientImmunization?.uuid}>
        <tr className={styles.immunizationRow}>
          <td className="omrs-medium">
            <div className={styles.expandSequence}>
              <svg
                className={`omrs-icon ${hasExistingDoses(patientImmunization) &&
                  styles.expandButton}`}
                fill="var(--omrs-color-ink-low-contrast)"
                onClick={() => {
                  hasExistingDoses(patientImmunization) &&
                    setToggleOpen(!toggleOpen);
                }}
              >
                <use
                  xlinkHref={
                    hasExistingDoses(patientImmunization)
                      ? toggleOpen
                        ? "#omrs-icon-chevron-up"
                        : "#omrs-icon-chevron-down"
                      : ""
                  }
                />
              </svg>
            </div>
            <span>{patientImmunization.vaccineName}</span>
          </td>
          <td>
            <div className={`${styles.alignRight}`}>
              {getRecentVaccinationText(t, patientImmunization)}
            </div>
          </td>
          <td>
            <div className={styles.headerAdd}>
              <button
                className={`${styles.addButton}`}
                onClick={() =>
                  openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
                    {
                      vaccineName: patientImmunization?.vaccineName,
                      vaccineUuid: patientImmunization?.vaccineUuid,
                      sequences: patientImmunization?.sequences
                    }
                  ])
                }
              >
                +
              </button>{" "}
            </div>
          </td>
        </tr>
        {toggleOpen && (
          <tr
            id={patientImmunization?.uuid}
            className={`immunizationSequenceRow ${vaccinationRowStyles.sequenceRow}`}
          >
            <td colSpan={4}>
              <table
                className={`omrs-type-body-regular immunizationSequenceTable ${vaccinationRowStyles.sequenceTable}`}
              >
                <thead>
                  <tr>
                    <td>{t("sequence", "Sequence")}</td>
                    <td>{t("vaccination date", "Vaccination Date")}</td>
                    <td>{t("expiration date", "Expiration Date")}</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                  {renderSequenceTable(match, t, patientImmunization)}
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </React.Fragment>
    )
  );
}

function getRecentVaccinationText(t, patientImmunization: ImmunizationData) {
  if (!hasExistingDoses(patientImmunization)) {
    return "";
  }
  let recentDose = patientImmunization.existingDoses[0];
  if (hasSequence(patientImmunization)) {
    return (
      recentDose.sequenceLabel +
      " on " +
      dayjs(recentDose.occurrenceDateTime).format("DD-MMM-YYYY")
    );
  }
  const singleDoseText = t("single dose", "Single Dose");
  return (
    singleDoseText +
    " on " +
    dayjs(recentDose.occurrenceDateTime).format("DD-MMM-YYYY")
  );
}

function hasExistingDoses(patientImmunization: ImmunizationData) {
  return (
    patientImmunization.existingDoses &&
    patientImmunization.existingDoses.length > 0
  );
}

function hasSequence(patientImmunization: ImmunizationData) {
  return (
    patientImmunization?.sequences && patientImmunization?.sequences?.length > 0
  );
}

function renderSequenceTable(match, t, immunization: ImmunizationData) {
  return immunization?.existingDoses?.map((dose, i) => {
    return (
      <tr key={`${immunization.vaccineUuid}-${i}`}>
        {hasSequence(immunization) && <td>{dose.sequenceLabel}</td>}
        {hasSequence(immunization) || (
          <td>{t("single dose", "Single Dose")}</td>
        )}
        <td>
          <div className={`${styles.alignRight}`}>
            {dayjs(dose.occurrenceDateTime).format("DD-MMM-YYYY")}
          </div>
        </td>
        <td>
          <div className={`${styles.alignRight}`}>
            {dayjs(dose.expirationDate).format("DD-MMM-YYYY")}
          </div>
        </td>
        <td>
          {
            <Link to={`${match.path}/${dose.immunizationObsUuid}`}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-low-contrast)"
                onClick={() =>
                  openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
                    {
                      vaccineName: immunization?.vaccineName,
                      vaccineUuid: immunization?.vaccineUuid,
                      immunizationObsUuid: dose?.immunizationObsUuid,
                      manufacturer: dose.manufacturer,
                      lotNumber: dose.lotNumber,
                      expirationDate: dose.expirationDate,
                      sequences: immunization.sequences,
                      currentDose: {
                        sequenceLabel: dose.sequenceLabel,
                        sequenceNumber: dose.sequenceNumber
                      },
                      vaccinationDate: dose.occurrenceDateTime
                    }
                  ])
                }
              >
                <use xlinkHref="#omrs-icon-chevron-right" />
              </svg>
            </Link>
          }
        </td>
      </tr>
    );
  });
}

type ImmunizationProps = { immunization: any };
