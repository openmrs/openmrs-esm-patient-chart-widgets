import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";
import { startVisitPrompt } from "../../../widgets/visit/start-visit-prompt.component";
import { useVisit } from "../../../widgets/visit/use-visit";

export default function StartVisitOverflowMenuItem() {
  const { t } = useTranslation();
  const { currentVisit, error } = useVisit();

  return (
    !currentVisit && (
      <button
        className="bx--overflow-menu-options__btn"
        role="menuitem"
        title={t("Add Past Visit", "Add Past Visit")}
        data-floating-menu-primary-focus
        onClick={() => startVisitPrompt()}
        style={{
          maxWidth: "100vw"
        }}
      >
        <span className="bx--overflow-menu-options__option-content">
          {t("Start Visit", "Start Visit")}
        </span>
      </button>
    )
  );
}
