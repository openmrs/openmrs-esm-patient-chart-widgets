import { newWorkspaceItem } from "@openmrs/esm-api";

export function openHeightAndWeightTab(addComponent, componentName): void {
  newWorkspaceItem({
    component: addComponent,
    name: componentName,
    props: {
      match: { params: {} }
    },
    inProgress: false,
    validations: (workspaceTabs: any[]) =>
      workspaceTabs.findIndex(tab => tab.component === addComponent)
  });
}
