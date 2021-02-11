import React from "react";
import dayjs from "dayjs";
import Button from "carbon-components-react/es/components/Button";
import CaretDown16 from "@carbon/icons-react/es/caret--down/16";
import CaretUp16 from "@carbon/icons-react/es/caret--up/16";
import capitalize from "lodash-es/capitalize";
import ContactDetails from "../contact-details/contact-details.component";
import placeholder from "../../assets/placeholder.png";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { age } from "../contact-details/age-helpers";
import styles from "./patient-banner.scss";

export default function PatientBanner() {
  const [showContactDetails, setShowContactDetails] = React.useState(false);
  const [isLoadingPatient, patient, , patientErr] = useCurrentPatient();
  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

  return (
    <>
      {!isLoadingPatient && !patientErr && (
        <div className={styles.container}>
          <div className={styles.patientBanner}>
            <div className={styles.patientAvatar}>
              <img src={placeholder} alt="Patient avatar" />
            </div>
            <div className={styles.patientInfo}>
              <div className={styles.row}>
                <span className={styles.patientName}>{getPatientNames()} </span>
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
