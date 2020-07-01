import { newModalItem } from "./visit-dialog-resource";
import { StartVisitConfirmation } from "./visit-button-component";

export function startVisitPrompt(onPromptClosed?: () => void) {
  newModalItem({
    component: StartVisitConfirmation(),
    name: "Prompt start Visit",
    props: { closeComponent: () => onPromptClosed?.() }
  });
}
