import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styles from "./immunizations-detailed-summary.css";
import vaccinationRowStyles from "./vaccination-row.css";
import { ImmunizationsForm } from "./immunizations-form.component";
import dayjs from "dayjs";
import { openWorkspaceTab } from "../shared-utils";
import { useTranslation } from "react-i18next";

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
            <div className={styles.expandSeries}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-low-contrast)"
                onClick={() => setToggleOpen(!toggleOpen)}
              >
                <use
                  xlinkHref={
                    isImmunizationNotGiven(patientImmunization)
                      ? ""
                      : toggleOpen
                      ? "#omrs-icon-chevron-up"
                      : "#omrs-icon-chevron-down"
                  }
                />
              </svg>
            </div>
            <span>{patientImmunization.vaccineName}</span>
          </td>
          <td>
            <div className={`${styles.alignRight}`}>
              {getRecentVaccinationText(patientImmunization)}
            </div>
          </td>
          <td>
            <div className={styles.headerAdd}>
              <button
                className={`omrs-unstyled ${styles.addBtn}`}
                onClick={() =>
                  openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
                    {
                      vaccineName: patientImmunization?.vaccineName,
                      vaccineUuid: patientImmunization?.vaccineUuid,
                      isSeries: patientImmunization?.isSeries,
                      series: patientImmunization?.series
                    }
                  ])
                }
              >
                {t("addButton", "Add")}{" "}
              </button>{" "}
            </div>
          </td>
        </tr>
        {toggleOpen && (
          <tr
            id={patientImmunization?.uuid}
            className={`immunizationSeriesRow ${vaccinationRowStyles.seriesRow}`}
          >
            <td colSpan={4}>
              <table
                className={`omrs-type-body-regular immunizationSeriesTable ${vaccinationRowStyles.seriesTable}`}
              >
                <thead>
                  <tr>
                    {patientImmunization?.isSeries && (
                      <td>{capitalize(t("series", "Series"))}</td>
                    )}
                    {patientImmunization?.isSeries || <td></td>}
                    <td>
                      {capitalize(t("vaccination date", "Vaccination Date"))}
                    </td>
                    <td>
                      {capitalize(t("expiration date", "Expiration Date"))}
                    </td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>{renderSeriesTable(match, patientImmunization)}</tbody>
              </table>
            </td>
          </tr>
        )}
      </React.Fragment>
    )
  );
}

function getRecentVaccinationText(patientImmunization) {
  if (isImmunizationNotGiven(patientImmunization)) {
    return "";
  }
  let recentDose = patientImmunization.doses[0];
  if (patientImmunization?.isSeries) {
    return (
      recentDose.currentDoseLabel +
      " on " +
      dayjs(recentDose.occurrenceDateTime).format("DD-MMM-YYYY")
    );
  }
  return dayjs(recentDose.occurrenceDateTime).format("DD-MMM-YYYY");
}

function isImmunizationNotGiven(patientImmunization: any) {
  return !patientImmunization.doses || patientImmunization.doses.length === 0;
}

function renderSeriesTable(match, immunization) {
  return immunization?.doses?.map((dose, i) => {
    return (
      <tr key={`${immunization.uuid}-${i}`}>
        {immunization.isSeries && (
          <td className="omrs-medium">{dose.currentDoseLabel}</td>
        )}
        {immunization.isSeries || <td></td>}
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
                      encounterUuid: dose?.encounterUuid,
                      manufacturer: dose.manufacturer.reference,
                      lotNumber: dose.lotNumber,
                      expirationDate: dose.expirationDate,
                      isSeries: immunization.isSeries,
                      series: immunization.series,
                      currentDose: {
                        label: dose.currentDoseLabel,
                        value: dose.doseNumber
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

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.toUpperCase();
};

type ImmunizationProps = { immunization: any };
