import React, { useState, useEffect } from "react";
import { newWorkspaceItem, useCurrentPatient } from "@openmrs/esm-api";
import { getVisitsForPatient } from "./visit.resource";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./visit-dashboard.css";
import NewVisit from "./new-visit-component";
import EditVisit from "./edit-visit-component";
import { DataCaptureComponentProps } from "../shared-utils";

export default function VisitDashboard(props: VisitDashboardProps) {
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const [isNewVisit, setIsNewVisit] = useState<boolean>();
  const [editVisit, setEditVisit] = useState<boolean>();
  const [visitDashboard, setVisitDashboard] = useState<boolean>(true);
  const [hasChanged, setHasChanged] = React.useState<boolean>();
  const [editMode, setEditMode] = useState<boolean>(true);

  const handleVisitStart = () => {
    setIsNewVisit(!isNewVisit);
    setVisitDashboard(false);
    setEditMode(true);
  };

  const handleEditVisit = () => {
    setEditVisit(!editVisit);
    setVisitDashboard(!visitDashboard);
  };

  return (
    <div className={`omrs-card ${styles.card}`}>
      {visitDashboard && (
        <div className={styles.visitContainer}>
          <div>
            <div className={`${styles.visitRadioStyle} omrs-radio-button`}>
              <input
                type="radio"
                name="visitRadio"
                id="input1"
                onClick={handleVisitStart}
              />
              <label htmlFor="input1">Start new visit</label>
            </div>
            <svg
              className="omrs-icon"
              fill="var(--omrs-color-ink-low-contrast)"
            >
              <use xlinkHref="#omrs-icon-chevron-right" />
            </svg>
          </div>
          <div>
            <div className={`${styles.visitRadioStyle} omrs-radio-button`}>
              <input
                type="radio"
                name="visitRadio"
                id="input2"
                onClick={handleEditVisit}
              />
              <label htmlFor="input2">Edit Visit</label>
            </div>
            <svg
              className="omrs-icon"
              fill="var(--omrs-color-ink-low-contrast)"
            >
              <use xlinkHref="#omrs-icon-chevron-right" />
            </svg>
          </div>
        </div>
      )}
      {isNewVisit && (
        <NewVisit
          onVisitStarted={() => {}}
          onCanceled={() => {
            setIsNewVisit(false);
            setVisitDashboard(!visitDashboard);
          }}
          viewMode={editMode}
          closeComponent={props.closeComponent}
        />
      )}
      {editVisit && (
        <EditVisit
          onVisitStarted={() => {
            setIsNewVisit(true);
            setVisitDashboard(false);
            setEditVisit(false);
            setEditMode(false);
          }}
          onCanceled={() => {
            setEditVisit(!editVisit);
            setVisitDashboard(true);
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
