import React from "react";
import styles from "./vital-header-details.component.scss";

interface VitalHeaderStateDetailsProps {
  unitName: string;
  value: string | number;
  unitSymbol: string | React.ReactNode;
}

const VitalHeaderStateDetails: React.FC<VitalHeaderStateDetailsProps> = ({
  unitName,
  value,
  unitSymbol
}) => {
  return (
    <div className={styles.vitalsHeaderStateDetailsContainer}>
      <label className={styles.label01}>{unitName}</label>
      <label>
        <span className={styles.bodyShort02}>{value} </span>
        <span className={styles.vitalsDetailsBodyShort01}>{unitSymbol}</span>
      </label>
    </div>
  );
};

export default VitalHeaderStateDetails;
