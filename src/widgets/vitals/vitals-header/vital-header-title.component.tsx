import React from "react";
import styles from "./vital-header-title.component.scss";
import {
  WarningFilled20,
  ChevronDown20,
  ChevronUp20
} from "@carbon/icons-react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { Button } from "carbon-components-react";
import { PatientVitals } from "../vitals-biometrics.resource";
import { isEmpty } from "lodash-es";
import { useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { switchTo } from "@openmrs/esm-extensions";
dayjs.extend(isToday);

interface VitalsHeaderStateTitleProps {
  view: string;
  vitals: PatientVitals;
  toggleView(): void;
  showDetails: boolean;
}

const VitalsHeaderStateTitle: React.FC<VitalsHeaderStateTitleProps> = ({
  view,
  vitals,
  toggleView,
  showDetails
}) => {
  const { t } = useTranslation();
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const launchVitalsBiometricsForm = () => {
    const url = `/patient/${patientUuid}/vitalsbiometrics/form`;
    switchTo("workspace", url, {
      title: t("recordVitalsAndBiometrics", "Record Vitals and Biometrics")
    });
  };
  return (
    <>
      {!isEmpty(vitals) ? (
        <div className={styles.vitalsHeader}>
          <span className={styles.alignCenter}>
            {view === "Warning" && (
              <WarningFilled20
                title={"WarningFilled"}
                aria-label="Add"
                className={styles.warningColor}
              />
            )}
            <span className={styles.vitalName}>Vitals & Biometrics</span>
            <span className={styles.bodyShort01}>
              {t("lastRecorded", "Last Recorded")}:{" "}
              {dayjs(vitals.date).isToday()
                ? `${t("today", "Today")}, ${dayjs(vitals.date).format(
                    "hh:mm A"
                  )}`
                : dayjs(vitals.date).format("DD - MMM - YYYY")}
            </span>
          </span>
          <div className={styles.alignCenter}>
            <Button
              className={styles.buttonText}
              kind="ghost"
              size="small"
              onClick={launchVitalsBiometricsForm}
            >
              {t("recordVitals", "Record Vitals")}
            </Button>
            {showDetails ? (
              <ChevronUp20
                className={styles.expandButton}
                title={"ChevronUp"}
                onClick={toggleView}
              />
            ) : (
              <ChevronDown20
                className={styles.expandButton}
                title={"ChevronDown"}
                onClick={toggleView}
              />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.vitalsHeader}>
          <span className={styles.alignCenter}>
            {view === "Warning" && (
              <WarningFilled20
                aria-label="Add"
                className={styles.warningColor}
              />
            )}
            <span className={styles.vitalName}>Vitals & Biometrics</span>
            <span className={styles.bodyShort01}>
              {t(
                "haveNotBeenRecorderForThisPatient",
                "have not been recorded for this patient"
              )}
            </span>
          </span>
          <div className={styles.alignCenter}>
            <Button className={styles.buttonText} kind="ghost" size="small">
              {t("recordVitals", "Record Vitals")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VitalsHeaderStateTitle;
