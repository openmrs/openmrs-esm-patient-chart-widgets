import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";
import { ConfigurableLink, useCurrentPatient } from "@openmrs/esm-framework";
import styles from "./edit-patient-details.scss";

export default function EditPatientDetailsOverflowMenuItem() {
  const [
    isLoadingPatient,
    existingPatient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { t } = useTranslation();
  return (
    <ConfigurableLink
      to={`\${openmrsSpaBase}/patient/${patientUuid}/edit/`}
      className={styles.noUnderline}
    >
      <CustomOverflowMenuItem
        itemText={t("Edit Patient Details", "Edit Patient Details")}
      />
    </ConfigurableLink>
  );
}
