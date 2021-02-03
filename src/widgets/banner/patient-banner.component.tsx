import React from "react";
import ReactDOM from "react-dom";

import dayjs from "dayjs";
import {
  Button,
  Form,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  TextInput
} from "carbon-components-react";
import { CaretDown16, CaretUp16 } from "@carbon/icons-react";
import capitalize from "lodash-es/capitalize";

import { useCurrentPatient } from "@openmrs/esm-react-utils";

import ContactDetails from "../contact-details/contact-details.component";

import placeholder from "../../assets/placeholder.png";
import { age } from "../contact-details/age-helpers";
import styles from "./patient-banner.scss";

export default function PatientBanner() {
  const [showContactDetails, setShowContactDetails] = React.useState(false);
  const [isStartingVisit, setIsStartingVisit] = React.useState(false);
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
                <OverflowMenu flipped>
                  {/* <OverflowMenuItem
                    onClick={() => setIsStartingVisit(true)}
                    itemText="Start Visit"
                  /> */}
                  <ModalStateManager
                    renderLauncher={({ setOpen }) => (
                      <OverflowMenuItem
                        onClick={() => setOpen(true)}
                        itemText="Start Visit"
                      />
                    )}
                  >
                    {({ open, setOpen }) => (
                      <Modal
                        hasForm={true}
                        modalHeading="Start Visit"
                        size="sm"
                        open={open}
                        onRequestClose={() => setOpen(false)}
                        preventCloseOnClickOutside={true}
                      >
                        <Form>
                          <p>
                            Select the type of visit you would like to start
                          </p>
                          <TextInput id="visitStartDate" labelText="Date" />
                          <TextInput id="visitStartTime" labelText="Time" />
                          <TextInput
                            id="visitLocation"
                            labelText="Location of visit"
                          />
                          <TextInput id="visitType" labelText="Type of visit" />
                        </Form>
                      </Modal>
                    )}
                  </ModalStateManager>
                  <OverflowMenuItem itemText="Edit Patient Details" />
                  <OverflowMenuItem isDelete itemText="Mark Patient Deceased" />
                </OverflowMenu>
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
                  size="field"
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

const ModalStateManager = ({
  renderLauncher: LauncherContent,
  children: ModalContent
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {!ModalContent || typeof document === "undefined"
        ? null
        : ReactDOM.createPortal(
            <ModalContent open={open} setOpen={setOpen} />,
            document.body
          )}
      {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
    </>
  );
};
