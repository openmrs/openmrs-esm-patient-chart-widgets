import React from "react";
import { StartVisitConfirmation } from "./visit-button.component";

export function startVisitPrompt(onPromptClosed?: () => void) {
  //TODO replace with actual item
  const newModalItem = (item: any) => {};

  newModalItem({
    component: <StartVisitConfirmation newModalItem={newModalItem} />,
    name: "Prompt start Visit",
    props: { closeComponent: () => onPromptClosed?.() }
  });
}
