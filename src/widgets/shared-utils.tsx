import { newWorkspaceItem } from "@openmrs/esm-api";
import { getStartedVisit } from "./visit/visit-utils";
import { newModalItem } from "./visit/visit-dialog-resource";
import { StartVisitConfirmation } from "./visit/visit-button-component";
import { isEmpty } from "lodash-es";
import { startVisitPrompt } from "./visit/start-visit-prompt";

export function openWorkspaceTab<
  TProps = DataCaptureComponentProps,
  TParams = any
>(
  componentToAdd: React.FC<TProps>,
  componentName: string,
  params?: TParams,
  requiresVisit = true
): void {
  if (isEmpty(getStartedVisit.value) && requiresVisit) {
    startVisitPrompt();
  } else {
    newWorkspaceItem({
      component: componentToAdd,
      name: componentName,
      props: {
        match: { params: params ? params : {} }
      },
      inProgress: false,
      validations: (workspaceTabs: Array<{ component: React.FC }>) =>
        workspaceTabs.findIndex(tab => tab.component === componentToAdd)
    });
  }
}

export function capitalize(s): string {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type DataCaptureComponentProps = {
  entryStarted: () => void;
  entrySubmitted: () => void;
  entryCancelled: () => void;
  closeComponent: () => void;
};
