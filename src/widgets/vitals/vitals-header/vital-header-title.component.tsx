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
import { PatientVitals } from "../vitals-card.resource";
import { isEmpty } from "lodash-es";
import { useTranslation } from "react-i18next";
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
            <Button className={styles.buttonText} kind="ghost" size="small">
              {t("recordVitals", "Record Vitals")}
            </Button>
            {showDetails ? (
              <ChevronUp20 title={"ChevronUp"} onClick={toggleView} />
            ) : (
              <ChevronDown20 title={"ChevronDown"} onClick={toggleView} />
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
