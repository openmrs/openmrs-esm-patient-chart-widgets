import { switchTo } from "@openmrs/esm-framework";
import React from "react";
import { StartVisitConfirmation } from "./visit-button.component";

export function startVisitPrompt(onPromptClosed?: () => void) {
  const newModalItem = (item: any) => switchTo("dialog", "/start-visit", item);

  newModalItem({
    component: <StartVisitConfirmation newModalItem={newModalItem} />,
    name: "Prompt start Visit",
    props: { closeComponent: () => onPromptClosed?.() }
  });
}
