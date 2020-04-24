import { newWorkspaceItem } from "@openmrs/esm-api";

export const openWorkspaceTab = (componentToAdd, componentName, params?) => {
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
};
