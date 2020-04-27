import React, { useEffect, useState } from "react";
import { openWorkspaceTab } from "../shared-utils";
import VisitDashboard from "./visit-dashboard-component";
import styles from "./visit-button.css";
import { getStartedVisit, visitMode, visitItem } from "./visit-utils";
import dayjs from "dayjs";
import { isEmpty } from "lodash-es";

export default function VisitButton(props: VisitButtonProps) {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitStarted, setVisitStarted] = useState<boolean>();

  useEffect(() => {
    const sub = getStartedVisit.subscribe((visit: visitItem) => {
      setSelectedVisit(visit);
    });
    return () => sub && sub.unsubscribe();
  }, []);

  const startVisit = () => {
    return (
      <div>
        <button
          className={styles.startVisitButton}
          onClick={() => {
            openWorkspaceTab(VisitDashboard, "Visit");
            setVisitStarted(true);
          }}
        >
          Start visit
        </button>
      </div>
    );
  };

  const editVisit = () => {
    return (
      selectedVisit && (
        <div className={styles.editContainer}>
          <span>{selectedVisit.visitData.visitType.display}</span>
          <span>
            {`(${dayjs(selectedVisit.visitData.startDatetime).format(
              "YYYY-MM-DD"
            )})`}
          </span>
          {isEmpty(selectedVisit.visitData.stopDatetime) && (
            <button className={styles.editVisitButton}>End</button>
          )}
          <svg className="omrs-icon" onClick={() => setSelectedVisit(null)}>
            <use xlinkHref="#omrs-icon-close"></use>
          </svg>
        </div>
      )
    );
  };

  return (
    <div className={`${styles.visitButtonContainer}`}>
      {(selectedVisit && selectedVisit.mode === visitMode.NEWVISIT) ||
      selectedVisit == null
        ? startVisit()
        : editVisit()}
    </div>
  );
}

type VisitButtonProps = {};
