import React from "react";
import { useTranslation } from "react-i18next";
import { openVisitDashboard } from "../../../widgets/visit/visit-button.component";
import { ExtensionSlot } from "@openmrs/esm-framework";

export default function AddPastVisitOverflowMenuItem() {
  const { t } = useTranslation();
  return (
    <ExtensionSlot
      extensionSlotName="custom-overflow-menu-item"
      state={{
        itemText: t("Add Past Visit", "Add Past Visit"),
        onClick: () =>
          openVisitDashboard(t("visitDashboard", "Visit Dashboard"))
      }}
    />
  );
}
