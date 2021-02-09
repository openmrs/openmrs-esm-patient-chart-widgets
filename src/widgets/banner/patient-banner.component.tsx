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
import { getVisitsForPatient } from "../visit/visit.resource";

export default function PatientBanner() {
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [hasActiveVisit, setHasActiveVisit] = useState(false);
  const [isLoadingPatient, patient, , patientErr] = useCurrentPatient();
  const { t } = useTranslation();
  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

  useEffect(() => {
    if (patient) {
      const abortController = new AbortController();
      const sub = getVisitsForPatient(
        patient.id,
        abortController,
        "custom:(stopDatetime)"
      ).subscribe(({ ok, data }) => {
        if (ok) {
          setHasActiveVisit(data.results?.some(v => v.stopDatetime == null));
        }
      });

      return () => sub.unsubscribe();
    }
  }, [patient]);

  return (
    <>
      {!isLoadingPatient && !patientErr && (
        <div className={styles.container}>
          <div className={styles.patientBanner}>
            <div className={styles.patientAvatar}>
              <img src={placeholder} alt="Patient avatar" />
            </div>
            <div className={styles.patientInfo}>
              <div className={(styles.row, styles.leftJustified)}>
                <span className={styles.patientName}>{getPatientNames()}</span>
                {hasActiveVisit && (
                  <Tag
                    className={styles.patientActiveVisitIndicator}
                    type="blue"
                  >
                    {t("Active Visit")}
                  </Tag>
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
