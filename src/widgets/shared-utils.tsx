import { newWorkspaceItem } from "@openmrs/esm-api";
import { getStartedVisit } from "./visit/visit-utils";
import { newModalItem } from "./visit/visit-dialog-resource";
import { startVisitPrompt } from "./visit/visit-button-component";
import { isEmpty } from "lodash-es";

export function openWorkspaceTab<
  TProps = DataCaptureComponentProps,
  TParams = any
>(componentToAdd: React.FC<TProps>, componentName: string, params?: TParams) {
  if (isEmpty(getStartedVisit.value)) {
    newModalItem({
      component: startVisitPrompt(),
      name: "Prompt start Visit",
      props: { closeComponent: () => {} }
    });
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

export type DataCaptureComponentProps = {
  entryStarted: () => void;
  entrySubmitted: () => void;
  entryCancelled: () => void;
  closeComponent: () => void;
};
