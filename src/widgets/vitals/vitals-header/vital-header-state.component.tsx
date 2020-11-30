import { useConfig, useCurrentPatient } from "@openmrs/esm-react-utils";
import React, { useEffect, useState } from "react";
import {
  PatientVitals,
  performPatientsVitalsSearch
} from "../vitals-card.resource";
import styles from "./vital-header-state.component.scss";
import VitalHeaderStateDetails from "./vital-header-details.compont";
import isToday from "dayjs/plugin/isToday";
import VitalsHeaderStateTitle from "./vital-header-title.component";
import { isEmpty } from "lodash-es";
import dayjs from "dayjs";
dayjs.extend(isToday);
interface viewState {
  view: "Default" | "Warning";
}

const VitalHeader: React.FC = () => {
  const config = useConfig();
  const [, , patientUuid] = useCurrentPatient();
  const [vitals, setVitals] = useState<PatientVitals>();
  const [displayState, setDisplayState] = useState<viewState>({
    view: "Default"
  });
  const [showDetails, setShowDetails] = useState(false);
  const toggleView = () => setShowDetails(prevState => !prevState);

  useEffect(() => {
    performPatientsVitalsSearch(config.concepts, patientUuid).subscribe(
      vitals => {
        vitals.length > 0 && setVitals(vitals[0]);
      }
    );
  }, [patientUuid, config]);

  useEffect(() => {
    if (vitals && !dayjs(vitals.date).isToday()) {
      setDisplayState({ view: "Warning" });
    }
  }, [vitals]);

  return (
    <>
      {vitals && (
        <div
          className={`${
            displayState.view === "Warning"
              ? styles.warningBackground
              : styles.defaultBackground
          } ${styles.vitalHeaderStateContainer}`}
        >
          <VitalsHeaderStateTitle
            toggleView={toggleView}
            showDetails={showDetails}
            view={displayState.view}
            date={vitals.date}
            isEmpty={isEmpty(vitals)}
          />
          {showDetails && (
            <>
              <div className={styles.row}>
                <VitalHeaderStateDetails
                  unitName="Temp"
                  unitSymbol="°C"
                  value={vitals.temperature}
                />
                <VitalHeaderStateDetails
                  unitName="BP"
                  unitSymbol="mmHg"
                  value={`${vitals.systolic} / ${vitals.diastolic}`}
                />
                <VitalHeaderStateDetails
                  unitName="Heart Rate"
                  unitSymbol="bpm"
                  value={vitals.pulse}
                />
                <VitalHeaderStateDetails
                  unitName="SPO2"
                  unitSymbol="%"
                  value={vitals.oxygenSaturation}
                />
              </div>
              <div className={styles.row}>
                <VitalHeaderStateDetails
                  unitName="R.Rate"
                  unitSymbol="/min"
                  value={vitals.temperature}
                />
                <VitalHeaderStateDetails
                  unitName="Height"
                  unitSymbol="cm"
                  value={`${vitals.systolic} / ${vitals.diastolic}`}
                />
                <VitalHeaderStateDetails
                  unitName="BMI"
                  unitSymbol={
                    <span>
                      kg/m<sub>2</sub>2
                    </span>
                  }
                  value={vitals.pulse}
                />
                <VitalHeaderStateDetails
                  unitName="Weight"
                  unitSymbol="kg"
                  value={vitals.weight}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default VitalHeader;
