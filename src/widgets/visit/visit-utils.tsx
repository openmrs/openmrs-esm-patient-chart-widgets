import { newWorkspaceItem } from "@openmrs/esm-framework";
import { BehaviorSubject } from "rxjs";
import { Visit } from "./visit.resource";

export default function openVisitsNoteWorkspace(componentName, title) {
  newWorkspaceItem({
    component: componentName,
    name: title,
    props: {},
    inProgress: false,
    validations: (workspaceTabs: Array<any>) =>
      workspaceTabs.findIndex(tab => tab.component === componentName)
  });
}

export const getStartedVisit = new BehaviorSubject<visitItem>(null);

export type visitItem = {
  mode: visitMode;
  visitData?: Visit;
  status: visitStatus;
  anythingElse?: any;
};

export enum visitMode {
  NEWVISIT = "startVisit",
  EDITVISIT = "editVisit",
  LOADING = "loadingVisit"
}

export enum visitStatus {
  NOTSTARTED = "notStarted",
  ONGOING = "ongoing"
}
