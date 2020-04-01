import { newWorkspaceItem } from "@openmrs/esm-api";
import { BehaviorSubject } from "rxjs";

export default function openVisitsNoteWorkspace(componentName, title) {
  newWorkspaceItem({
    component: componentName,
    name: title,
    props: {},
    inProgress: false,
    validations: (workspaceTabs: any[]) =>
      workspaceTabs.findIndex(tab => tab.component === componentName)
  });
}

export const getStartedVisit = new BehaviorSubject<visitItem>(null);

export type visitItem = {
  mode: visitMode;
  visitData: any;
  status: visitStatus;
  anythingElse?: any;
};

export enum visitMode {
  NEWVISIT = "startVisit",
  EDITVISI = "editVisit",
  LOADING = "loadingVisit"
}
export enum visitStatus {
  NOTSTARTED = "notStarted",
  ONGOING = "ongoing"
}
