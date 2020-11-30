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
dayjs.extend(isToday);

interface VitalsHeaderStateTitleProps {
  view: string;
  date: Date;
  toggleView: Function;
  showDetails: boolean;
  isEmpty: boolean;
}

const VitalsHeaderStateTitle: React.FC<VitalsHeaderStateTitleProps> = ({
  view,
  date,
  toggleView,
  showDetails,
  isEmpty
}) => {
  return (
    <>
      {!isEmpty ? (
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
              Last recorded:{" "}
              {dayjs(date).isToday()
                ? `Today, ${dayjs(date).format("hh:mm A")}`
                : dayjs(date).format("DD - MMM - YYYY")}
            </span>
          </span>
          <div className={styles.alignCenter}>
            <Button className={styles.buttonText} kind="ghost" size="small">
              Record Vitals
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
              have not been recorded for this patient
            </span>
          </span>
          <div className={styles.alignCenter}>
            <Button className={styles.buttonText} kind="ghost" size="small">
              Record Vitals
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VitalsHeaderStateTitle;
