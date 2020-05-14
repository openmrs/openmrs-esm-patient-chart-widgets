import React, { useReducer, useState } from "react";
import styles from "./visit-dashboard.css";
import NewVisit from "./new-visit-component";
import EditVisit from "./edit-visit-component";
import { DataCaptureComponentProps } from "../shared-utils";

export default function VisitDashboard(props: VisitDashboardProps) {
  const visitDashboardInitialState: visitDashboardPropsDefaultState = {
    editMode: true,
    displayVisitDashboard: true,
    displayNewVisit: false,
    displayEditVisit: false
  };
  const [state, dispatch] = useReducer(reducer, visitDashboardInitialState);

  return (
    <div className={`omrs-card ${styles.card}`}>
      {state.displayVisitDashboard && (
        <div className={styles.visitContainer}>
          <button
            type="button"
            className={`omrs-btn omrs-outlined-action`}
            onClick={() => dispatch({ displayMode: displayModes.NEW_VISIT })}
          >
            New Visit
            <svg className="omrs-icon">
              <use xlinkHref="#omrs-icon-chevron-right"></use>
            </svg>
          </button>

          <button
            type="button"
            className={`omrs-btn omrs-outlined-action`}
            onClick={() => dispatch({ displayMode: displayModes.EDIT_VISIT })}
          >
            Edit Visit
            <svg className="omrs-icon">
              <use xlinkHref="#omrs-icon-zoomoutmap"></use>
            </svg>
          </button>
        </div>
      )}
      {state.displayNewVisit && (
        <NewVisit
          onVisitStarted={() => {}}
          onCanceled={() => {
            dispatch({ displayMode: displayModes.DASHBOARD });
          }}
          viewMode={state.editMode}
          closeComponent={props.closeComponent}
        />
      )}
      {state.displayEditVisit && (
        <EditVisit
          onVisitStarted={() => {
            dispatch({ displayMode: displayModes.EDITTING_VISIT });
          }}
          onCanceled={() => {
            dispatch({ displayMode: displayModes.DASHBOARD });
          }}
          closeComponent={() => props.closeComponent()}
        />
      )}
    </div>
  );
}

VisitDashboard.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

type VisitDashboardProps = DataCaptureComponentProps & {};

type visitDashboardPropsDefaultState = {
  displayVisitDashboard: boolean;
  displayNewVisit: boolean;
  displayEditVisit: boolean;
  editMode: boolean;
};

enum displayModes {
  NEW_VISIT = "newVisit",
  EDIT_VISIT = "editVisit",
  DASHBOARD = "dashboard",
  EDITTING_VISIT = "edittingVisit"
}

type NEW_VISIT = {
  displayMode: displayModes;
  visitData?: any;
  anythingElse?: any;
};

type EDIT_VISIT = {
  displayMode: displayModes;
  visitData?: any;
  anythingElse?: any;
};

type actionTypes = EDIT_VISIT | NEW_VISIT;

function reducer(
  state: visitDashboardPropsDefaultState,
  action: actionTypes
): visitDashboardPropsDefaultState {
  switch (action.displayMode) {
    case displayModes.NEW_VISIT:
      return {
        displayVisitDashboard: false,
        displayNewVisit: true,
        displayEditVisit: false,
        editMode: true
      };
    case displayModes.EDIT_VISIT:
      return {
        displayVisitDashboard: false,
        displayNewVisit: false,
        displayEditVisit: true,
        editMode: false
      };
    case displayModes.EDITTING_VISIT:
      return {
        displayVisitDashboard: false,
        displayNewVisit: true,
        displayEditVisit: false,
        editMode: false
      };
    default:
      return {
        displayVisitDashboard: true,
        displayNewVisit: false,
        displayEditVisit: false,
        editMode: true
      };
  }
}
