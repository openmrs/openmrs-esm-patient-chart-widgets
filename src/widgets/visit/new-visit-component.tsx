import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./new-visit.css";

export default function NewVisit(props: NewVisitProps) {
  return (
    <SummaryCard name="Starting New Visit" styles={{ margin: 0 }}>
      <div className={styles.newVisitContainer}>
        <div
          className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
        >
          <label htmlFor="visitType">Visit Type</label>
          <select name="visitType" id="visitType">
            <option value={1}>HIV Outpatient Visit</option>
            <option value={2}>CDM Visit</option>
          </select>
        </div>
        <div
          className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
        >
          <label htmlFor="startDate">Start Date/Time</label>
          <div
            className={styles.flexRow}
            style={{ display: "flex", padding: "0rem 0.25rem" }}
          >
            <input
              type="date"
              name="startDate"
              id="startDate"
              style={{ flex: 1, marginRight: "0.625rem" }}
            />
            <input
              type="time"
              name="startTime"
              id="startTime"
              style={{ flex: 1, marginLeft: "0.625rem" }}
            />
          </div>
        </div>
        <div
          className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
        >
          <label htmlFor="location">Location</label>
          <select name="location" id="location">
            <option value={1}>Location 1</option>
            <option value={2}>Location 2</option>
          </select>
        </div>
        <div
          className={styles.newVisitButtonContainer}
          style={{ flexDirection: "row" }}
        >
          <button className={`omrs-btn omrs-outlined-neutral`}>Cancel</button>
          <button className={`omrs-btn omrs-filled-action`}>Start</button>
        </div>
      </div>
    </SummaryCard>
  );
}

type NewVisitProps = {};
