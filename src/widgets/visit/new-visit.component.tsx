import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { isEmpty } from "lodash-es";
import { getCurrentPatientUuid, FetchResponse } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import LocationSelect from "../location/location-select.component";
import VisitTypeSelect from "./visit-type-select.component";
import {
  NewVisitPayload,
  saveVisit,
  UpdateVisitPayload,
  updateVisit
} from "./visit.resource";
import useSessionUser from "../../utils/use-session-user";
import { getStartedVisit, visitMode, visitStatus } from "./visit-utils";
import styles from "./new-visit.css";

export default function NewVisit(props: NewVisitProps) {
  const currentUser = useSessionUser();
  const { t } = useTranslation();

  const [patientUuid, setPatientUuid] = React.useState<string>();

  const [visitStartDate, setVisitStartDate] = React.useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [visitStartTime, setVisitStartTime] = React.useState(
    dayjs(new Date()).format("HH:mm")
  );
  const [visitEndDate, setVisitEndDate] = React.useState("");
  const [visitEndTime, setVisitEndTime] = React.useState("");
  const [locationUuid, setLocationUuid] = React.useState("");
  const [visitUuid, setVisitUuid] = React.useState<string>();

  if (!locationUuid && currentUser?.sessionLocation?.uuid) {
    // init with session location
    setLocationUuid(currentUser?.sessionLocation?.uuid);
  }

  const [visitTypeUuid, setVisitTypeUuid] = React.useState("");
  const [viewMode, setViewMode] = React.useState<boolean>();

  // events
  const startVisit = () => {
    let visitPayload: NewVisitPayload = {
      patient: patientUuid,
      startDatetime: new Date(`${visitStartDate} ${visitStartTime}:00`),
      visitType: visitTypeUuid,
      location: locationUuid
    };
    saveVisit(visitPayload, new AbortController()).subscribe(
      (response: FetchResponse<any>) => {
        props.onVisitStarted(response.data);
        getStartedVisit.next({
          mode: visitMode.NEWVISIT,
          visitData: response.data,
          status: visitStatus.ONGOING
        });
        props.closeComponent();
      },
      error => {
        console.error("Error saving visit: ", error);
      }
    );
  };

  const handleUpdateVisit = (): void => {
    let stopDatetime =
      visitEndDate && new Date(`${visitEndDate} ${visitEndTime}:00`);
    let updateVisitPayload: UpdateVisitPayload = {
      startDatetime: new Date(`${visitStartDate} ${visitStartTime}:00`),
      visitType: visitTypeUuid,
      location: locationUuid
    };

    if (!isEmpty(stopDatetime)) {
      updateVisitPayload.stopDatetime = stopDatetime;
    }

    const ac = new AbortController();
    updateVisit(visitUuid, updateVisitPayload, ac).subscribe(({ data }) => {
      getStartedVisit.next({
        mode: visitMode.EDITVISIT,
        visitData: data,
        status: visitStatus.ONGOING
      });
      props.closeComponent();
    });
  };

  const onStartDateChanged = event => {
    setVisitStartDate(event.target.value);
  };

  const onStartTimeChanged = event => {
    setVisitStartTime(event.target.value);
  };
  const onVisitStopDateChanged = event => {
    setVisitEndDate(event.target.value);
  };

  const onVisitStopTimeChanged = event => {
    setVisitEndTime(event.target.value);
  };

  const onLocationChanged = uuid => {
    setLocationUuid(uuid);
  };

  const onVisitTypeChanged = uuid => {
    setVisitTypeUuid(uuid);
  };

  useEffect(() => {
    if (!patientUuid) {
      const sub = getCurrentPatientUuid().subscribe(uuid => {
        setPatientUuid(uuid);
      });
      return () => sub && sub.unsubscribe();
    }
  }, [patientUuid]);

  useEffect(() => {
    const sub = getStartedVisit.subscribe(visit => {
      if (visit) {
        setVisitUuid(visit.visitData.uuid);
        setLocationUuid(visit.visitData.location.uuid);
        setVisitStartDate(
          dayjs(new Date(visit.visitData.startDatetime)).format("YYYY-MM-DD")
        );
        setVisitStartTime(
          dayjs(new Date(visit.visitData.startDatetime)).format("HH:mm")
        );
        visit.visitData.stopDatetime &&
          setVisitEndDate(
            dayjs(new Date(visit.visitData.stopDatetime)).format("YYYY-MM-DD")
          );
        visit.visitData.stopDatetime &&
          setVisitEndTime(
            dayjs(new Date(visit.visitData.stopDatetime)).format("HH:mm")
          );

        setVisitTypeUuid(visit.visitData.visitType.uuid);
      }
    });

    return () => sub && sub.unsubscribe();
  }, [props.viewMode]);

  const newVisitView = () => {
    return (
      <SummaryCard
        name={t("startNewVisit", "Start new visit")}
        styles={{ margin: 0 }}
      >
        <div className={styles.newVisitContainer}>
          <div
            className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
          >
            <label htmlFor="visitType">
              {t("typeOfVisit", "Type of visit")}
            </label>
            <VisitTypeSelect
              onVisitTypeChanged={visitType =>
                onVisitTypeChanged(visitType.uuid)
              }
              id="visitType"
              visitTypeUuid={visitTypeUuid}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "space-between"
            }}
          >
            <div
              className={`${styles.newVisitInputContainer}  ${styles.flexColumn}`}
              style={{ width: "50%" }}
            >
              <label htmlFor="startDate">{t("startDate", "Start date")}</label>
              <div className="omrs-datepicker">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  defaultValue={visitStartDate}
                  max={dayjs(new Date().toUTCString()).format("YYYY-MM-DD")}
                  onChange={onStartDateChanged}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
            <div
              className={`${styles.newVisitInputContainer}  ${styles.flexColumn}`}
              style={{ width: "50%" }}
            >
              <label htmlFor="startTime">{t("startTime", "Start time")}</label>
              <div className="omrs-datepicker">
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  defaultValue={visitStartTime}
                  onChange={onStartTimeChanged}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-access-time"></use>
                </svg>
              </div>
            </div>
          </div>
          <div
            className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
          >
            <label htmlFor="location">{t("location", "Location")}</label>
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
              {t("cancel", "Cancel")}
            </button>
            <button
              className={`omrs-btn omrs-filled-action`}
              onClick={() => startVisit()}
            >
              {t("start", "Start")}
            </button>
          </div>
        </div>
      </SummaryCard>
    );
  };

  const editVisitView = () => {
    const headerText = t("editVisit", "Edit Visit");
    return (
      <SummaryCard name={headerText} styles={{ margin: 0 }}>
        <div className={styles.newVisitContainer}>
          <div
            className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
          >
            <label htmlFor="visitType">
              {t("typeOfVisit", "Type of visit")}
            </label>
            <VisitTypeSelect
              onVisitTypeChanged={visitType =>
                onVisitTypeChanged(visitType.uuid)
              }
              id={"visitType"}
              visitTypeUuid={visitTypeUuid}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "space-between"
            }}
          >
            <div
              className={`${styles.newVisitInputContainer}  ${styles.flexColumn}`}
              style={{ width: "50%" }}
            >
              <label htmlFor="startDate">{t("startDate", "Start date")}</label>
              <div className="omrs-datepicker">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  data-testid="date-select"
                  value={visitStartDate}
                  onChange={onStartDateChanged}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
            <div
              className={`${styles.newVisitInputContainer}  ${styles.flexColumn}`}
              style={{ width: "50%" }}
            >
              <label htmlFor="startTime">{t("startTime", "Start time")}</label>
              <div className="omrs-datepicker">
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  defaultValue={visitStartTime}
                  onChange={onStartTimeChanged}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-access-time"></use>
                </svg>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "space-between"
            }}
          >
            <div
              className={`${styles.newVisitInputContainer}  ${styles.flexColumn}`}
              style={{ width: "50%" }}
            >
              <label htmlFor="endDate">{t("endDate", "End date")}</label>
              <div className="omrs-datepicker">
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  data-testid="date-select-end-date"
                  value={visitEndDate}
                  onChange={onVisitStopDateChanged}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
            <div
              className={`${styles.newVisitInputContainer}  ${styles.flexColumn}`}
              style={{ width: "50%" }}
            >
              <label htmlFor="endTime">{t("endTime", "End time")}</label>
              <div className="omrs-datepicker">
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  data-testid="time-select-end-time"
                  value={visitEndTime}
                  onChange={onVisitStopTimeChanged}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-access-time"></use>
                </svg>
              </div>
            </div>
          </div>
          <div
            className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}
          >
            <label htmlFor="location">{t("location", "Location")}</label>
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
              onClick={() => {
                props.onCanceled();
                getStartedVisit.next(null);
              }}
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              className={`omrs-btn omrs-filled-action`}
              onClick={handleUpdateVisit}
            >
              {t("editVisit", "Edit visit")}
            </button>
          </div>
        </div>
      </SummaryCard>
    );
  };

  return <>{props.viewMode ? newVisitView() : editVisitView()}</>;
}

export type NewVisitProps = {
  onVisitStarted(visit: any): void;
  onCanceled(): void;
  viewMode?: any | null;
  closeComponent(): void;
};
