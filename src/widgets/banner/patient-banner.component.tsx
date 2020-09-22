import React from "react";
import styles from "./patient-banner.component.css";
import { age } from "../profile/age-helpers";
import dayjs from "dayjs";
import ProfileSection from "../profile/profile-section.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import { Trans } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function PatientBanner(props: PatientBannerProps) {
  const [showingDemographics, setShowDemographics] = React.useState(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { pathname } = useLocation();

  return (
    <div className={styles.patientBanner}>
      {!isLoadingPatient && !patientErr && (
        <div
          className={styles.patientBanner}
          role="button"
          onClick={toggleDemographics}
          tabIndex={0}
        >
          <div className={styles.demographics}>
            <div className={`${styles.patientName} omrs-type-title-5`}>
              {getPatientNames()}
            </div>
            <div className={`${styles.otherDemographics}`}>
              <span className={`${styles.demographic} omrs-type-body-regular`}>
                {age(patient.birthDate)}
              </span>
            </div>
            <div className={`${styles.otherDemographics}`}>
              <span className={`${styles.desktopLabel} omrs-type-body-small`}>
                <Trans i18nKey="born">Born</Trans>
              </span>
              <span
                className={`${styles.demographic} ${styles.hideDemographics} omrs-type-body-regular`}
              >
                {dayjs(patient.birthDate).format("DD-MMM-YYYY")}
              </span>
            </div>
            <div className={`${styles.otherDemographics}`}>
              <span className={`${styles.desktopLabel} omrs-type-body-small`}>
                <Trans i18nKey="gender">Gender</Trans>
              </span>
              <span className={`${styles.demographic} omrs-type-body-regular`}>
                {patient.gender}
              </span>
            </div>
            <div className={`${styles.otherDemographics}`}>
              <span className={`${styles.desktopLabel} omrs-type-body-small`}>
                <Trans i18nKey="preferredId">Preferred ID</Trans>
              </span>
              <span className={`${styles.demographic} omrs-type-body-regular`}>
                {getPreferredIdentifier()}
              </span>
            </div>
          </div>
          <div className={styles.moreBtn}>
            <Link
              to={
                "/patient-registration/patient/" +
                patient.id +
                "?afterUrl=" +
                pathname
              }
              className="omrs-link omrs-text-neutral"
            >
              <Trans i18nKey="edit">Edit</Trans>
            </Link>
            <button
              className={`${styles.moreBtn} omrs-unstyled`}
              onClick={toggleDemographics}
            >
              {showingDemographics ? (
                <Trans i18nKey="close">Close</Trans>
              ) : (
                <Trans i18nKey="open">Open</Trans>
              )}
            </button>
            <svg
              className={`omrs-icon`}
              fill="var(--omrs-color-ink-medium-contrast)"
            >
              <use
                xlinkHref={
                  showingDemographics
                    ? "#omrs-icon-chevron-up"
                    : "#omrs-icon-chevron-down"
                }
              />
            </svg>
          </div>
        </div>
      )}
      {showingDemographics && (
        <div className={styles.patientProfile}>
          <ProfileSection patient={patient} match={props.match} />
        </div>
      )}
    </div>
  );

  function getPatientNames() {
    return `${patient.name[0].family.toUpperCase()}, ${patient.name[0].given.join(
      " "
    )}`;
  }

  function toggleDemographics() {
    setShowDemographics(!showingDemographics);
  }

  function getPreferredIdentifier() {
    return (
      patient.identifier.find(id => id.use === "official").value ||
      patient.identifier[0].value
    );
  }
}

type PatientBannerProps = {
  match: any;
};
