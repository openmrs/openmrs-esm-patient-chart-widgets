import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";

export default function StartVisitOverflowMenuItem() {
  const { t } = useTranslation();
  return <CustomOverflowMenuItem itemText={t("Start Visit", "Start Visit")} />;
}
