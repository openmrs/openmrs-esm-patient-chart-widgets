import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";
import { startVisitPrompt } from "../../../widgets/visit/start-visit-prompt.component";
import { useVisit } from "../../../widgets/visit/use-visit";

export default function StartVisitOverflowMenuItem() {
  const { t } = useTranslation();
  const { currentVisit, error } = useVisit();

  const startNewVisit = () => {
    startVisitPrompt();
  };

  return (
    !currentVisit && (
      <CustomOverflowMenuItem
        onClick={startNewVisit}
        itemText={t("Start Visit", "Start Visit")}
      />
    )
  );
}
