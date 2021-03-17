import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";

export default function AddPastVisitOverflowMenuItem() {
  const { t } = useTranslation();
  return (
    <CustomOverflowMenuItem itemText={t("Add Past Visit", "Add Past Visit")} />
  );
}
