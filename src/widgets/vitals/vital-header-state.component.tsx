import { useConfig, useCurrentPatient } from "@openmrs/esm-react-utils";
import React, { useEffect, useState } from "react";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { WarningFilled20, Warning20 } from "@carbon/icons-react";
import styles from "./vital-header-state.component.scss";

interface VitalHeaderStateProps {
  state: "Default" | "Warning";
}

const VitalHeaderState: React.FC<VitalHeaderStateProps> = ({ state }) => {
  const config = useConfig();
  const [, , patientUuid] = useCurrentPatient();
  const [vitals, setVitals] = useState<Array<any>>();
  useEffect(() => {
    performPatientsVitalsSearch(config.concepts, patientUuid).subscribe(
      vitals => {
        console.log(vitals);
      }
    );
  }, [patientUuid, config]);
  return (
    <>
      <div className={styles.warningBackground}>
        <WarningFilled20 aria-label="Add" className={styles.warningColor} />
      </div>
    </>
  );
};

export default VitalHeaderState;
