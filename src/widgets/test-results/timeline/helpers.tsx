import * as React from "react";
import { OBSERVATION_INTERPRETATION } from "../loadPatientTestData/helpers";
import { ObsRecord } from "../loadPatientTestData/types";
import styles from "./timeline.scss";
import * as CSS from "csstype";

export const Grid: React.FC<{
  style: CSS.Properties;
  padding?: boolean;
  dataColumns: number;
}> = ({ dataColumns, style = {}, padding = false, ...props }) => (
  <div
    style={{
      ...style,
      gridTemplateColumns: `${
        padding ? "9em " : ""
      } repeat(${dataColumns}, 5em)`
    }}
    className={styles["grid"]}
    {...props}
  />
);

export const PaddingContainer = React.forwardRef<HTMLElement, any>(
  (props, ref) => (
    <div ref={ref} className={styles["padding-container"]} {...props} />
  )
);

const TimeSlotsInner: React.FC<{ style: CSS.Properties }> = props => (
  <div className={styles["time-slot-inner"]} {...props} />
);

export const Main: React.FC = () => <main className={styles["padded-main"]} />;

export const ShadowBox: React.FC = () => (
  <div className={styles["shadow-box"]} />
);

const TimelineCell: React.FC<{
  text: string;
  interpretation?: OBSERVATION_INTERPRETATION;
}> = ({ text, interpretation = OBSERVATION_INTERPRETATION.NORMAL }) => {
  let additionalClassname: string;

  switch (interpretation) {
    case OBSERVATION_INTERPRETATION.OFF_SCALE_HIGH:
      additionalClassname = styles["off-scale-high"];
      break;

    case OBSERVATION_INTERPRETATION.CRITICALLY_HIGH:
      additionalClassname = styles["critically-high"];
      break;

    case OBSERVATION_INTERPRETATION.HIGH:
      additionalClassname = styles["high"];
      break;

    case OBSERVATION_INTERPRETATION.OFF_SCALE_LOW:
      additionalClassname = styles["off-scale-low"];
      break;

    case OBSERVATION_INTERPRETATION.CRITICALLY_LOW:
      additionalClassname = styles["critically-low"];
      break;

    case OBSERVATION_INTERPRETATION.LOW:
      additionalClassname = styles["low"];
      break;

    case OBSERVATION_INTERPRETATION.NORMAL:
    default:
      additionalClassname = "";
  }

  return (
    <div className={`${styles["timeline-cell"]} ${additionalClassname}`}>
      <p>{text}</p>
    </div>
  );
};

export const RowStartCell = ({ title, range, unit, shadow = false }) => (
  <div
    className={styles["timeline-cell"]}
    style={{
      position: "sticky",
      left: "0px",
      boxShadow: shadow ? "8px 0 20px 0 rgba(0,0,0,0.15)" : undefined
    }}
  >
    <p>
      {title}
      <br></br>
      {range} {unit}
    </p>
  </div>
);

export const TimeSlots: React.FC<{ style: CSS.Properties }> = ({
  children = undefined,
  style
}) => (
  <TimeSlotsInner style={style}>
    <div>{children}</div>
  </TimeSlotsInner>
);

export const GridItems = React.memo<{
  sortedTimes: string[];
  obs: ObsRecord[];
}>(({ sortedTimes, obs }) => (
  <>
    {sortedTimes.map((_, i) => {
      if (!obs[i]) return <TimelineCell text={"--"} />;
      const interpretation = obs[i].meta.assessValue(obs[i].value);
      return (
        <TimelineCell text={obs[i].value} interpretation={interpretation} />
      );
    })}
  </>
));
