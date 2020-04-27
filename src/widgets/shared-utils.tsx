import { newWorkspaceItem } from "@openmrs/esm-api";

export function openWorkspaceTab<
  TProps = DataCaptureComponentProps,
  TParams = any
>(componentToAdd: React.FC<TProps>, componentName: string, params?: TParams) {
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

export type DataCaptureComponentProps = {
  entryStarted: () => void;
  entrySubmitted: () => void;
  entryCancelled: () => void;
  closeComponent: () => void;
};
