import React, { useState, useEffect } from "react";
import { match, useRouteMatch, Link } from "react-router-dom";
import styles from "./immunizations-detailed-summary.css";
import vaccinationRowStyles from "./vaccination-row.css";
import { ImmunizationsForm } from "./immunizations-form.component";
import dayjs from "dayjs";
import { openWorkspaceTab } from "../shared-utils";
import { useTranslation } from "react-i18next";

export default function VaccinationRow(params: ImmunizationProps) {
  const [patientImmunization, setPatientImmunization] = useState(null);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [recentVaccination, setRecentVaccination] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    setPatientImmunization(params.immunization);
    //setRecentVaccination(getRecentVaccinationText(patientImmunization));
  }, [params]);

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
                    toggleOpen
                      ? "#omrs-icon-chevron-up"
                      : "#omrs-icon-chevron-down"
                  }
                />
              </svg>
            </div>
            <span>{patientImmunization?.resource?.vaccineCode.text}</span>
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
                      immunizationUuid: patientImmunization?.resource?.uuid,
                      immunizationName:
                        patientImmunization?.resource?.vaccineCode.text,
                      manufacturer:
                        patientImmunization?.resource?.manufacturer.reference,
                      expirationDate:
                        patientImmunization?.resource?.expirationDate,
                      isSeries: patientImmunization?.resource?.isSeries
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
            id={patientImmunization?.resource?.uuid}
            className={`immunizationSeriesRow ${vaccinationRowStyles.seriesRow}`}
          >
            <td colSpan={4}>
              <table
                className={`omrs-type-body-regular immunizationSeriesTable ${vaccinationRowStyles.seriesTable}`}
              >
                <thead>
                  <tr>
                    {patientImmunization?.resource?.isSeries && <td>{t("series", "SERIES")}</td>}
                    {patientImmunization?.resource?.isSeries || <td></td>}
                    <td>{t("vaccination date", "VACCINATION DATE")}</td>
                    <td>{t("expiration date", "EXPIRATION DATE")}</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {renderSeriesTable(
                    patientImmunization?.resource?.protocolApplied,
                    patientImmunization,
                    patientImmunization?.resource?.isSeries
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
  let protocolSorted = patientImmunization.resource.protocolApplied.sort(
    (a, b) =>
      a.protocol.doseNumberPositiveInt - b.protocol.doseNumberPositiveInt
  );
  let latestProtocol = protocolSorted[protocolSorted.length - 1].protocol;
  if (patientImmunization?.resource?.isSeries) {
    return (
      latestProtocol.series +
      " on " +
      dayjs(latestProtocol.occurrenceDateTime).format("DD-MMM-YYYY")
    );
  }
  return dayjs(latestProtocol.occurrenceDateTime).format("DD-MMM-YYYY");
}

function renderSeriesTable(protocols, immunization, isSeries) {
  const match = useRouteMatch();
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
            <Link to={`${match.path}/${immunization.resource.uuid}`}>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-ink-low-contrast)"
                onClick={() =>
                  openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
                    {
                      immunizationUuid: immunization.resource.uuid,
                      immunizationName: immunization.resource.vaccineCode.text,
                      manufacturer:
                        immunization.resource.manufacturer.reference,
                      expirationDate: protocolApplied.protocol.expirationDate,
                      isSeries: immunization.resource.isSeries,
                      series: protocolApplied.protocol.series,
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
