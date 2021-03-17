import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";

export default function EditPatientDetailsOverflowMenuItem() {
  const { t } = useTranslation();
  return (
    <CustomOverflowMenuItem
      itemText={t("Edit Patient Details", "Edit Patient Details")}
    />
  );
}
