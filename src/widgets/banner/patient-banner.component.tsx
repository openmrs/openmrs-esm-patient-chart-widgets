import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import capitalize from "lodash-es/capitalize";
import styles from "./patient-banner.scss";
import ContactDetails from "../contact-details/contact-details.component";
import { Button, Tag } from "carbon-components-react";
import { CaretDown16, CaretUp16 } from "@carbon/icons-react";
import { ExtensionSlot, useCurrentPatient } from "@openmrs/esm-react-utils";
import { useTranslation } from "react-i18next";
import { age } from "../contact-details/age-helpers";
import { getStartedVisit, visitItem, visitMode } from "../visit/visit-utils";

export default function PatientBanner() {
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [isLoadingPatient, patient, , patientErr] = useCurrentPatient();
  const [hasActiveVisit, setActiveVisit] = useState(false);
  const { t } = useTranslation();
  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

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
              <ExtensionSlot
                extensionSlotName="patient-photo"
                state={{ patientUuid: patient.id }}
              />
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
