import React from "react";
import { getCurrentPatientUuid } from "@openmrs/esm-api";
import dayjs from "dayjs";
import { NewVisitPayload, saveVisit } from "./visit.resource";
import { FetchResponse } from "@openmrs/esm-api/dist/openmrs-fetch";
import LocationSelect from "../location/location-select.component";
import VisitTypeSelect from "./visit-type-select.component";
import { toOmrsDateString } from "../../utils/omrs-dates";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./new-visit.css";
import useSessionUser from "../../utils/use-session-user";

export default function NewVisit(props: NewVisitProps) {
  const [currentUser] = useSessionUser();

  const [patientUuid, setPatientUuid] = React.useState<string>();

  const [visitStartDate, setVisitStartDate] = React.useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [visitStartTime, setVisitStartTime] = React.useState(
    dayjs(new Date()).format("HH:mm")
  );
  const [locationUuid, setLocationUuid] = React.useState();

  if (!locationUuid && currentUser?.sessionLocation?.uuid) {
    //init with session location
    setLocationUuid(currentUser?.sessionLocation?.uuid);
  }

  const [visitTypeUuid, setVisitTypeUuid] = React.useState();

  // events
  const startVisit = () => {
    let visitPayload: NewVisitPayload = {
      patient: patientUuid,
      startDatetime: toOmrsDateString(
        new Date(`${visitStartDate} ${visitStartTime}:00`)
      ),
      visitType: visitTypeUuid,
      location: locationUuid
    };
    saveVisit(visitPayload, new AbortController()).subscribe(
      (response: FetchResponse<any>) => {
        props.onVisitStarted(response.data);
      },
      error => {
        console.error("error", error);
      }
    );
  };

  const onStartDateChanged = event => {
    setVisitStartDate(event.target.value);
  };

  const onStartTimeChanged = event => {
    setVisitStartTime(event.target.value);
  };

  const onLocationChanged = uuid => {
    setLocationUuid(uuid);
  };

  const onVisitTypeChanged = uuid => {
    setVisitTypeUuid(uuid);
  };

  if (!patientUuid) {
    getCurrentPatientUuid().subscribe(uuid => {
      setPatientUuid(uuid);
    });
  }

  return (
    <SummaryCard name="Starting New Visit" styles={{ margin: 0 }}>
      <div className={styles.newVisitContainer}>
        <div
          className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
        >
          <label htmlFor="visitType">Visit Type</label>
          <VisitTypeSelect
            onVisitTypeChanged={visitType => onVisitTypeChanged(visitType.uuid)}
            id={"visitType"}
          />
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
              data-testid="date-select"
              defaultValue={visitStartDate}
              onChange={onStartDateChanged}
              style={{ flex: 1, marginRight: "0.625rem" }}
            />
            <input
              type="time"
              name="startTime"
              id="startTime"
              data-testid="time-select"
              defaultValue={visitStartTime}
              onChange={onStartTimeChanged}
              style={{ flex: 1, marginLeft: "0.625rem" }}
            />
          </div>
        </div>
        <div
          className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
        >
          <label htmlFor="location">Location</label>
          <LocationSelect
            currentLocationUuid={locationUuid}
            onLocationChanged={location => onLocationChanged(location.uuid)}
            id={"location"}
          />
        </div>
        <div
          className={styles.newVisitButtonContainer}
          style={{ flexDirection: "row" }}
        >
          <button
            className={`omrs-btn omrs-outlined-neutral`}
            onClick={() => props.onCanceled()}
          >
            Cancel
          </button>
          <button
            className={`omrs-btn omrs-filled-action`}
            onClick={() => startVisit()}
          >
            Start
          </button>
        </div>
      </div>
    </SummaryCard>
  );
}

export type NewVisitProps = {
  onVisitStarted(visit: any): void;
  onCanceled(): void;
};
