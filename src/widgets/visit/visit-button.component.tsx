import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VisitDashboard from "./visit-dashboard.component";
import styles from "./visit-button.css";
import {
  getStartedVisit,
  visitItem,
  visitMode,
  visitStatus
} from "./visit-utils";
import dayjs from "dayjs";
import { isEmpty } from "lodash-es";
import { newModalItem } from "./visit-dialog.resource";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { newWorkspaceItem, FetchResponse } from "@openmrs/esm-api";
import {
  updateVisit,
  UpdateVisitPayload,
  getVisitsForPatient
} from "./visit.resource";

export default function VisitButton(props: VisitButtonProps) {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [, setVisitStarted] = useState<boolean>();
  const [, , patientUuid] = useCurrentPatient();

  useEffect(() => {
    const sub = getStartedVisit.subscribe((visit: visitItem) => {
      setSelectedVisit(visit);
    });
    return () => sub && sub.unsubscribe();
  }, [selectedVisit]);

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      const sub = getVisitsForPatient(patientUuid, abortController).subscribe(
        ({ data }) => {
          const currentVisit = data.results.find(
            visit =>
              dayjs(visit.startDatetime).format("DD-MM-YYYY") ===
              dayjs(new Date()).format("DD-MM-YYYY")
          );
          currentVisit &&
            getStartedVisit.next({
              mode: visitMode.LOADING,
              visitData: currentVisit,
              status: visitStatus.ONGOING
            });
        }
      );
      return () => sub && sub.unsubscribe();
    }
  }, [patientUuid]);

  const StartVisitButton: React.FC = () => {
    const { t } = useTranslation();
    return (
      <div>
        <button
          className={styles.startVisitButton}
          data-testid="start-visit"
          onClick={() => {
            openVisitDashboard(`${t("visitDashboard", "Visit Dashboard")}`);
            setVisitStarted(true);
          }}
        >
          {t("startVisit", "Start visit")}
        </button>
      </div>
    );
  };

  const EditVisitButton: React.FC = () => {
    const { t } = useTranslation();
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
            <button
              className={styles.editVisitButton}
              data-testid="end-visit"
              onClick={() => {
                newModalItem({
                  component: <EndVisit currentVisit={selectedVisit} />,
                  name: "End Visit",
                  props: null
                });
              }}
            >
              {t("end", "End")}
            </button>
          )}
          <svg
            className="omrs-icon"
            onClick={() => {
              newModalItem({
                component: (
                  <CloseActiveVisitConfirmation
                    currentVisit={getStartedVisit.value}
                  />
                ),
                name: "Cancel Visit",
                props: null
              });
            }}
          >
            <use xlinkHref="#omrs-icon-close"></use>
          </svg>
        </div>
      )
    );
  };

  return (
    <div className={`${styles.visitButtonContainer}`}>
      {isEmpty(selectedVisit) ? <StartVisitButton /> : <EditVisitButton />}
    </div>
  );
}

type VisitButtonProps = {};

export const StartVisitConfirmation: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.visitPromptContainer}>
      <h2>
        No active visit is selected. <br />
        Do you want to start a visit?
      </h2>
      <div className={styles.visitPromptButtonsContainer}>
        <button
          className={`omrs-btn omrs-outlined-action`}
          onClick={() => {
            openVisitDashboard(`${t("visitDashboard", "Visit Dashboard")}`);
            hideModal();
          }}
        >
          {t("yes", "Yes")}
        </button>
        <button
          className={`omrs-btn omrs-outlined-neutral`}
          onClick={() => hideModal()}
        >
          {t("no", "No")}
        </button>
      </div>
    </div>
  );
};

const CloseActiveVisitConfirmation: React.FC<EndVisitProps> = ({
  currentVisit
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.visitPromptContainer}>
      <h2>{t("endVisitPrompt", "Are you sure you want to end this visit?")}</h2>
      <p>
        {t("visitType", "Visit Type")}:{" "}
        {currentVisit.visitData.visitType.display} {t("location", "Location")}:{" "}
        {currentVisit.visitData?.location?.display}{" "}
        {t("startDate", "Start Date")}:{" "}
        {dayjs(currentVisit.visitData.startDatetime).format("DD-MMM-YYYY")}
      </p>
      <div className={styles.visitPromptButtonsContainer}>
        <button
          className={`omrs-btn omrs-outlined-action`}
          onClick={() => {
            getStartedVisit.next(null);
            hideModal();
          }}
        >
          {t("yes", "Yes")}
        </button>
        <button
          className={`omrs-btn omrs-outlined-neutral`}
          onClick={() => hideModal()}
        >
          {t("no", "No")}
        </button>
      </div>
    </div>
  );
};

interface EndVisitProps {
  currentVisit: visitItem;
}

export const EndVisit: React.FC<EndVisitProps> = ({ currentVisit }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.visitPromptContainer}>
      <h2>{t("endVisitPrompt", "Are you sure you wish to end this visit?")}</h2>
      <p>
        {t("visitType", "Visit Type")}:{" "}
        {currentVisit.visitData.visitType.display} {t("location", "Location")}:{" "}
        {currentVisit.visitData?.location?.display}{" "}
        {t("startDate", "Start Date")}:{" "}
        {dayjs(currentVisit.visitData.startDatetime).format("DD-MMM-YYYY")}
      </p>
      <div className={styles.visitPromptButtonsContainer}>
        <button
          className={`omrs-btn omrs-outlined-action`}
          onClick={() => {
            visitUpdate(currentVisit);
            hideModal();
          }}
        >
          {t("yes", "Yes")}
        </button>
        <button
          className={`omrs-btn omrs-outlined-neutral`}
          onClick={() => hideModal()}
        >
          {t("no", "No")}
        </button>
      </div>
    </div>
  );
};

const openVisitDashboard = (componentName: string): void => {
  newWorkspaceItem({
    component: VisitDashboard,
    name: componentName,
    props: {},
    inProgress: false,
    validations: (workspaceTabs: Array<{ component: React.FC }>) =>
      workspaceTabs.findIndex(tab => tab.component === VisitDashboard)
  });
};

const hideModal = () => {
  newModalItem({ component: null, name: null, props: null });
};

const visitUpdate = (currentVisit: visitItem) => {
  const visitData = currentVisit.visitData;
  const abortController = new AbortController();
  let payload: UpdateVisitPayload = {
    location: visitData.location.uuid,
    startDatetime: visitData.startDatetime,
    visitType: visitData.visitType.uuid,
    stopDatetime: new Date()
  };
  const sub = updateVisit(visitData.uuid, payload, abortController).subscribe(
    (response: FetchResponse) => {
      response.status === 200 && getStartedVisit.next(null);
    }
  );

  return () => sub && sub.unsubscribe();
};
