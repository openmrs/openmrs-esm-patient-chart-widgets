import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import { Button, Tag } from "carbon-components-react";
import { CaretDown16, CaretUp16 } from "@carbon/icons-react";
import capitalize from "lodash-es/capitalize";

import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { useTranslation } from "react-i18next";

import ContactDetails from "../contact-details/contact-details.component";

import placeholder from "../../assets/placeholder.png";
import { age } from "../contact-details/age-helpers";
import styles from "./patient-banner.scss";
import { getStartedVisit, visitItem } from "../visit/visit-utils";
import { fetchPatientPhotoUrl } from "@openmrs/esm-api";

export default function PatientBanner() {
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [isLoadingPatient, patient, , patientErr] = useCurrentPatient();
  const [hasActiveVisit, setActiveVisit] = useState(false);
  const [patientPhoto, setPatientPhoto] = useState(placeholder);
  const { t } = useTranslation();
  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

  useEffect(() => {
    if (patient) {
      fetchPatientPhotoUrl(patient.id, new AbortController()).then(
        url => url && setPatientPhoto(url)
      );
    }
  }, [patient]);

  useEffect(() => {
    const sub = getStartedVisit.subscribe((visit?: visitItem) => {
      setActiveVisit(visit !== null);
    });

    return () => sub.unsubscribe();
  }, []);

  return (
    <>
      {!isLoadingPatient && !patientErr && (
        <div className={styles.container}>
          <div className={styles.patientBanner}>
            <div className={styles.patientAvatar}>
              <img src={patientPhoto} alt="Patient avatar" />
            </div>
            <div className={styles.patientInfo}>
              <div className={(styles.row, styles.nameRow)}>
                <span className={styles.patientName}>{getPatientNames()}</span>
                {hasActiveVisit && (
                  <Tag type="blue">{t("Active Visit", "Active Visit")}</Tag>
                )}
              </div>
              <div className={styles.row}>
                <div className={styles.demographics}>
                  <span>{capitalize(patient.gender)}</span> &middot;{" "}
                  <span>{age(patient.birthDate)}</span> &middot;{" "}
                  <span>
                    {dayjs(patient.birthDate).format("DD - MMM - YYYY")}
                  </span>
                </div>
              </div>
              <div className={styles.row}>
                <span className={styles.identifiers}>
                  {getPatientIdentifiers()}
                </span>
                <Button
                  kind="ghost"
                  renderIcon={showContactDetails ? CaretUp16 : CaretDown16}
                  iconDescription="Toggle contact details"
                  onClick={toggleContactDetails}
                >
                  {showContactDetails
                    ? "Hide Contact Details"
                    : "Show Contact Details"}
                </Button>
              </div>
            </div>
          </div>
          {showContactDetails && (
            <ContactDetails
              address={patient.address}
              telecom={patient.telecom}
              patientId={patient.id}
            />
          )}
        </div>
      )}
    </>
  );

  function getPatientNames() {
    return `${patient.name[0].given.join(" ")} ${patient.name[0].family}`;
  }

  function getPatientIdentifiers() {
    return patient.identifier.map(i => i.value);
  }
}
