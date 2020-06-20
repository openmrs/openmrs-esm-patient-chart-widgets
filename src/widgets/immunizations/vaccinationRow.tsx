import React, { useState, useEffect } from "react";
import { useRouteMatch, Link} from "react-router-dom";
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
      <React.Fragment key={patientImmunization?.resource?.uuid}>
        <tr>
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
                      immunizationUuid: patientImmunization?.uuid,
                      immunizationName: patientImmunization?.vaccineName,
                      manufacturer:
                        patientImmunization?.manufacturer?.reference,
                      expirationDate: patientImmunization?.expirationDate,
                      isSeries: patientImmunization?.isSeries,
                      series: patientImmunization?.series
                    }
                  ])
                }
              >
                Add{" "}
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
                    {patientImmunization?.resource?.isSeries && (
                      <td>{t("series", "SERIES")}</td>
                    )}
                    {patientImmunization?.resource?.isSeries || <td></td>}
                    <td>{t("vaccination date", "VACCINATION DATE")}</td>
                    <td>{t("expiration date", "EXPIRATION DATE")}</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {renderSeriesTable(match,
                    patientImmunization?.protocolApplied,
                    patientImmunization,
                    patientImmunization?.isSeries
                  )}
                </tbody>
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
  let protocolSorted = patientImmunization.protocolApplied.sort(
    (a, b) =>
      a.protocol.doseNumberPositiveInt - b.protocol.doseNumberPositiveInt
  );
  let latestProtocol = protocolSorted[protocolSorted.length - 1].protocol;
  if (patientImmunization?.isSeries) {
    return (
      latestProtocol.series +
      " on " +
      dayjs(latestProtocol.occurrenceDateTime).format("DD-MMM-YYYY")
    );
  }
  return dayjs(latestProtocol.occurrenceDateTime).format("DD-MMM-YYYY");
}

function isImmunizationNotGiven(patientImmunization: any) {
  return (
    !patientImmunization.protocolApplied ||
    patientImmunization.protocolApplied.length === 0
  );
}

function renderSeriesTable(match, protocols, immunization, isSeries) {  
  return protocols?.map(protocolApplied => {
    return (
      <tr>
        {isSeries && (
          <td className="omrs-medium">{protocolApplied.protocol.series}</td>
        )}
        {isSeries || <td></td>}
        <td>
          <div className={`${styles.alignRight}`}>
            {dayjs(protocolApplied.protocol.occurrenceDateTime).format(
              "DD-MMM-YYYY"
            )}
          </div>
        </td>
        <td>
          <div className={`${styles.alignRight}`}>
            {dayjs(protocolApplied.protocol.expirationDate).format(
              "DD-MMM-YYYY"
            )}
          </div>
        </td>
        <td>
          {
            <Link to={`${match.path}/${immunization.uuid}`}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-low-contrast)"
                onClick={() =>
                  openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
                    {
                      immunizationUuid: immunization.uuid,
                      immunizationName: immunization.vaccineName,
                      manufacturer: immunization.manufacturer.reference,
                      expirationDate: protocolApplied.protocol.expirationDate,
                      isSeries: immunization.isSeries,
                      series: immunization.series,
                      vaccinationDate:
                        protocolApplied.protocol.occurrenceDateTime
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
