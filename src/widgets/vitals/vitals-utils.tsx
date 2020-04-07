import { newWorkspaceItem } from "@openmrs/esm-api";

export const openVitalsWorkspaceTab = (componentToAdd, componentName) => {
  newWorkspaceItem({
    component: componentToAdd,
    name: componentName,
    props: {
      match: { params: {} }
    },
    inProgress: false,
    validations: (workspaceTabs: any[]) =>
      workspaceTabs.findIndex(tab => tab.component === componentToAdd)
  });
};
