import React from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { switchTo } from "@openmrs/esm-extensions";

interface FormEntryProps {
  closeWorkspace?: () => void;
  formUuid: string;
  encounterUuid: string;
}

const FormEntry: React.FC<FormEntryProps> = ({
  closeWorkspace,
  formUuid,
  encounterUuid
}) => {
  closeWorkspace = closeWorkspace ?? (() => switchTo("workspace", ""));

  return (
    <ExtensionSlot
      extensionSlotName="form-widget-slot"
      state={{
        formUuid: formUuid,
        encounterUuid: encounterUuid,
        view: "form",
        closeWorkspace: closeWorkspace
      }}
    />
  );
};

export default FormEntry;
