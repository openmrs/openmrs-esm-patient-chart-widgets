import React from "react";
import { newWorkspaceItem } from "@openmrs/esm-api";
import MedicationOrderBasket from "./medication-order-basket.component";

export function MedicationButton(props: any) {
  return (
    <button
      className="omrs-btn omrs-text-neutral"
      onClick={() =>
        newWorkspaceItem({
          component: props.component,
          name: props.name,
          props: {
            match: {
              params: {
                orderUuid: props.orderUuid,
                drugName: props.drugName,
                action: props.action
              }
            }
          },
          inProgress: props.inProgress,
          validations: (workspaceTabs: any[]) =>
            workspaceTabs.findIndex(
              tab => tab.component === MedicationOrderBasket
            )
        })
      }
    >
      {props.label}
    </button>
  );
}
