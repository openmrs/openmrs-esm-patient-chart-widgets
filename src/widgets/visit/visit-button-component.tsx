import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import VisitDashboard from "./visit-dashboard-component";
import styles from "./visit-button.css";
import {
  getStartedVisit,
  visitItem,
  visitMode,
  visitStatus
} from "./visit-utils";
import dayjs from "dayjs";
import { isEmpty } from "lodash-es";
import { newModalItem } from "./visit-dialog-resource";
import { newWorkspaceItem, useCurrentPatient } from "@openmrs/esm-api";
import {
  updateVisit,
  UpdateVisitPayload,
  getVisitsForPatient
} from "./visit.resource";
import { FetchResponse } from "@openmrs/esm-api/dist/openmrs-fetch";
import { getTranslationsFor } from "../../utils/translations";

export default function VisitButton(props: VisitButtonProps) {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitStarted, setVisitStarted] = useState<boolean>();
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

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

  const startVisit = () => {
    return (
      <div>
        <button
          className={styles.startVisitButton}
          data-testid="start-visit"
          onClick={() => {
            openVisitDashboard();
            setVisitStarted(true);
          }}
        >
          {getTranslationsFor("start visit", "Start visit")}
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
              {getTranslationsFor("end", "End")}
            </button>
          )}
          <svg
            className="omrs-icon"
            onClick={() => {
              newModalItem({
                component: closeActiveVisitConfirmation(getStartedVisit.value),
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
      {isEmpty(selectedVisit) ? startVisit() : editVisit()}
    </div>
  );
}

type VisitButtonProps = {};

export const StartVisitConfirmation = (): React.ReactNode => {
  const { t } = useTranslation();
  return (
    <div className={styles.visitPromptContainer}>
      <h2>
        {t(
          "START_VISIT_CONFIRM_LABEL",
          "No active visit is selected. Do you want to start a visit?"
        )}
      </h2>
      <div className={styles.visitPromptButtonsContainer}>
        <button
          className={`omrs-btn omrs-outlined-action`}
          onClick={() => {
            openVisitDashboard();
            hideModal();
          }}
        >
          {getTranslationsFor("yes", "Yes")}
        </button>
        <button
          className={`omrs-btn omrs-outlined-neutral`}
          onClick={() => hideModal()}
        >
          {getTranslationsFor("no", "No")}
        </button>
      </div>
    </div>
  );
};

const closeActiveVisitConfirmation = (currentVisit: any): React.ReactNode => {
  return (
    <div className={styles.visitPromptContainer}>
      <h2>Are you sure to close this visit</h2>
      <p>
        Visit Type : {currentVisit.visitData.visitType.display} Location :{" "}
        {currentVisit.visitData?.location?.display} Start Date :{" "}
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
          Yes
        </button>
        <button
          className={`omrs-btn omrs-outlined-neutral`}
          onClick={() => hideModal()}
        >
          No
        </button>
      </div>
    </div>
  );
};

interface EndVisitProps {
  currentVisit: visitItem;
}

export const EndVisit: React.FC<EndVisitProps> = ({ currentVisit }) => {
  return (
    <div className={styles.visitPromptContainer}>
      <h2>
        <Trans i18nKey="End Visit Prompt Message">
          Are you sure you wish to end this visit?
        </Trans>
      </h2>
      <p>
        Visit Type : {currentVisit.visitData.visitType.display} Location :{" "}
        {currentVisit.visitData.location.display} Start Date :{" "}
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
          Yes
        </button>
        <button
          className={`omrs-btn omrs-outlined-neutral`}
          onClick={() => hideModal()}
        >
          No
        </button>
      </div>
    </div>
  );
};

const openVisitDashboard = () => {
  newWorkspaceItem({
    component: VisitDashboard,
    name: getTranslationsFor("visit dashboard", "Visit Dashboard"),
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
