import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";

export default function MarkPatientDeceasedOverflowMenuItem() {
  const { t } = useTranslation();
  return (
    <CustomOverflowMenuItem
      itemText={t("Mark Patient Deceased", "Mark Patient Deceased")}
    />
  );
}
