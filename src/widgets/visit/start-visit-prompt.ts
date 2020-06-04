import { newDialogBox } from "../../ui-components/dialog-box/dialog-box.resource";
import { startVisitConfirmation } from "./visit-button-component";

export function startVisitPrompt(onPromptClosed?: () => void) {
  newDialogBox({
    component: startVisitConfirmation,
    name: "Prompt start Visit",
    props: { closeComponent: () => onPromptClosed?.() }
  });
}
