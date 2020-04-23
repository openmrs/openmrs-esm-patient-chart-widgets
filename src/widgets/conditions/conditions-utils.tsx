import { newWorkspaceItem } from "@openmrs/esm-api";

export const openConditionsWorkspaceTab = (componentToAdd, componentName) => {
  newWorkspaceItem({
    component: componentToAdd,
    name: componentName,
    props: {
      match: { params: {} }
    },
    inProgress: false,
    validations: (workspaceTabs: Array<{ component: React.FC }>) =>
      workspaceTabs.findIndex(tab => tab.component === componentToAdd)
  });
};

export const openEditConditionsWorkspaceTab = (
  componentName,
  title,
  conditionUuid,
  name,
  clinicalStatus,
  onsetDateTime
) => {
  newWorkspaceItem({
    component: componentName,
    name: title,
    props: {
      match: {
        params: {
          conditionUuid,
          name,
          clinicalStatus,
          onsetDateTime
        }
      }
    },
    inProgress: false,
    validations: (workspaceTabs: Array<{ component: React.FC }>) =>
      workspaceTabs.findIndex(tab => tab.component === componentName)
  });
};
