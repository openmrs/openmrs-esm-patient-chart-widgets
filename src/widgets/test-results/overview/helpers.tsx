import React from "react";
import styles from "./lab-results.scss";
import { Information16 } from "@carbon/icons-react";
import { TableRow } from "carbon-components-react";
import { OBSERVATION_INTERPRETATION } from "../loadPatientTestData/helpers";

export function formatDate(date: Date) {
  const strArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const d = date.getDate();
  const m = strArray[date.getMonth()];
  const y = date.getFullYear();
  const h = date.getHours();
  const min = date.getMinutes();
  return (
    "" +
    m +
    " " +
    (d <= 9 ? "0" + d : d) +
    ", " +
    y +
    " · " +
    (h <= 9 ? "0" + h : h) +
    ":" +
    (min <= 9 ? "0" + min : min)
  );
}
export const headers = [
  { key: "name", header: "Test Name" },
  { key: "value", header: "Value" },
  { key: "range", header: "Reference Range" }
];
export const Main = ({ className = "", ...props }) => (
  <main {...props} className={`omrs-main-content ${className}`} />
);
export const Card = ({ ...props }) => (
  <div {...props} className={styles.card} />
);
export const InfoButton = () => (
  <Information16 className={styles["info-button"]} />
);
export const TypedTableRow: React.FC<{
  interpretation: OBSERVATION_INTERPRETATION;
}> = ({ interpretation, ...props }) => {
  switch (interpretation) {
    case OBSERVATION_INTERPRETATION.OFF_SCALE_HIGH:
      return <TableRow {...props} className={styles["off-scale-high"]} />;

    case OBSERVATION_INTERPRETATION.CRITICALLY_HIGH:
      return <TableRow {...props} className={styles["critically-high"]} />;

    case OBSERVATION_INTERPRETATION.HIGH:
      return <TableRow {...props} className={styles["high"]} />;

    case OBSERVATION_INTERPRETATION.OFF_SCALE_LOW:
      return <TableRow {...props} className={styles["off-scale-low"]} />;

    case OBSERVATION_INTERPRETATION.CRITICALLY_LOW:
      return <TableRow {...props} className={styles["critically-low"]} />;

    case OBSERVATION_INTERPRETATION.LOW:
      return <TableRow {...props} className={styles["low"]} />;

    case OBSERVATION_INTERPRETATION.NORMAL:
    default:
      return <TableRow {...props} />;
  }
};
