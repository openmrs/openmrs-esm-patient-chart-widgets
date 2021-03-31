import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Button from "carbon-components-react/es/components/Button";
import Tag from "carbon-components-react/es/components/Tag";
import TooltipDefinition from "carbon-components-react/es/components/TooltipDefinition";
import ChevronDown16 from "@carbon/icons-react/es/chevron--down/16";
import ChevronUp16 from "@carbon/icons-react/es/chevron--up/16";
import OverflowMenuVertical16 from "@carbon/icons-react/es/overflow-menu--vertical/16";
import capitalize from "lodash-es/capitalize";
import ContactDetails from "../contact-details/contact-details.component";
import styles from "./patient-banner.scss";
import { useCurrentPatient, ExtensionSlot } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { age } from "../contact-details/age-helpers";
import { useVisit } from "../visit/use-visit";
import { getStartedVisit, visitItem } from "../visit/visit-utils";
import CustomOverflowMenuComponent from "../../ui-components/custom-overflow-menu/overflow-menu.component";

export default function PatientBanner() {
  const { currentVisit, error } = useVisit();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [isLoadingPatient, patient, , patientErr] = useCurrentPatient();
  const [hasActiveVisit, setActiveVisit] = useState(false);
  const { t } = useTranslation();
  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

  useEffect(() => {
    if (currentVisit) {
      setActiveVisit(true);
    } else {
      const sub = getStartedVisit.subscribe((visit?: visitItem) => {
        setActiveVisit(visit !== null);
      });

      return () => sub.unsubscribe();
    }
    window.addEventListener("single-spa:routing-event", (evt: any) => {
      const patientChartRegex = `${window.spaBase}/patient/:patient/chart`;
      const newRegex = new RegExp(patientChartRegex);
      if (!newRegex.test(evt.target.location.pathname)) {
        getStartedVisit.next(null);
      }
    });
  }, [currentVisit]);

  return (
    <>
      {patient && !patientErr && (
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
                <div>
                  <span className={styles.patientName}>
                    {getPatientNames()}
                  </span>
                  {hasActiveVisit && (
                    <TooltipDefinition
                      style={{ top: "-0.25rem" }}
                      align="end"
                      tooltipText={
                        <div className={styles.tooltipPadding}>
                          <h6 style={{ marginBottom: "0.5rem" }}>
                            {currentVisit &&
                              currentVisit.visitType &&
                              currentVisit.visitType.name}
                          </h6>
                          <span>
                            <span className={styles.tooltipSmalltext}>
                              Started:{" "}
                            </span>
                            <span>
                              {dayjs(
                                currentVisit && currentVisit.startDatetime
                              ).format("DD - MMM - YYYY @ HH:mm")}
                            </span>
                          </span>
                        </div>
                      }
                    >
                      <Tag type="blue">{t("activeVisit", "Active Visit")}</Tag>
                    </TooltipDefinition>
                  )}
                </div>
                <div>
                  <CustomOverflowMenuComponent
                    menuTitle={
                      <>
                        Actions{" "}
                        <OverflowMenuVertical16
                          style={{ marginLeft: "0.5rem" }}
                        />
                      </>
                    }
                  >
                    <ExtensionSlot
                      extensionSlotName="patient-actions-slot"
                      key="patient-actions-slot"
                    />
                  </CustomOverflowMenuComponent>
                </div>
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
                  {getPatientIdentifiers().join(", ")}
                </span>
                <Button
                  kind="ghost"
                  renderIcon={showContactDetails ? ChevronUp16 : ChevronDown16}
                  iconDescription="Toggle contact details"
                  onClick={toggleContactDetails}
                  style={{ marginTop: "-0.25rem" }}
                >
                  {showContactDetails
                    ? t("hideAllDetails", "Hide all details")
                    : t("showAllDetails", "Show all details")}
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
