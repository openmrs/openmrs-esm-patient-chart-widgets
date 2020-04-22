import React, { useState, useEffect } from "react";
import { newWorkspaceItem, useCurrentPatient } from "@openmrs/esm-api";
import { getPatientVisits } from "./visit-resource";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./visit-dashboard.css";
import NewVisit from "./new-visit-component";
import EditVisit from "./edit-visit-component";

export default function VisitDashboard(props: VisitDashboardProps) {
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const [isNewVisit, setIsNewVisit] = useState<boolean>();
  const [editVisit, setEditVisit] = useState<boolean>();
  const [visitDashboard, setVisitDashboard] = useState<boolean>();

  const handleVisitStart = () => {
    setIsNewVisit(!isNewVisit);
    setVisitDashboard(!visitDashboard);
  };

  const handleEditVisit = () => {
    setEditVisit(!editVisit);
    setVisitDashboard(!visitDashboard);
  };
  return (
    <div>
      {!visitDashboard && (
        <div className={`omrs-card ${styles.card}`}>
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
        </div>
      )}
      {isNewVisit && <NewVisit />}
      {editVisit && <EditVisit />}
    </div>
  );
}

type VisitDashboardProps = {};
