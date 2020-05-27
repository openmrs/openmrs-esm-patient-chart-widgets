import { newModalItem } from "./visit-dialog-resource";
import { startVisitConfirmation } from "./visit-button-component";

export function startVisitPrompt(onPromptClosed?: Function) {
  newModalItem({
    component: startVisitConfirmation(),
    name: "Prompt start Visit",
    props: { closeComponent: () => onPromptClosed && onPromptClosed() }
  });
}
