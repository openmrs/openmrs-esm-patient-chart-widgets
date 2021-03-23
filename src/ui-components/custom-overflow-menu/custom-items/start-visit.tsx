import React from "react";
import { useTranslation } from "react-i18next";
import { startVisitPrompt } from "../../../widgets/visit/start-visit-prompt.component";
import { useVisit } from "../../../widgets/visit/use-visit";
import { ExtensionSlot } from "@openmrs/esm-framework";

export default function StartVisitOverflowMenuItem() {
  const { t } = useTranslation();
  const { currentVisit, error } = useVisit();

  return (
    !currentVisit && (
      <ExtensionSlot
        extensionSlotName="custom-overflow-menu-item"
        state={{
          itemText: t("Start Visit", "Start Visit"),
          onClick: () => startVisitPrompt()
        }}
      />
    )
  );
}
