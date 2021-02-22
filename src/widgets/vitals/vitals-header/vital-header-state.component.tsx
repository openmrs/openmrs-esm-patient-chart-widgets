import { useConfig, useCurrentPatient } from "@openmrs/esm-react-utils";
import React, { useEffect, useState } from "react";
import {
  PatientVitals,
  performPatientsVitalsSearch
} from "../vitals-biometrics.resource";
import styles from "./vital-header-state.component.scss";
import VitalHeaderStateDetails from "./vital-header-details.component";
import isToday from "dayjs/plugin/isToday";
import VitalsHeaderStateTitle from "./vital-header-title.component";
import dayjs from "dayjs";
import { InlineLoading } from "carbon-components-react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { isEmpty, first } from "lodash-es";
import { useTranslation } from "react-i18next";
import { useVitalsSignsConceptMetaData } from "../vitals-biometrics-form/use-vitalsigns";
dayjs.extend(isToday);
interface viewState {
  view: "Default" | "Warning";
}

const VitalHeader: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [, , patientUuid] = useCurrentPatient();
  const [vital, setVital] = useState<PatientVitals>();
  const [displayState, setDisplayState] = useState<viewState>({
    view: "Default"
  });
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleView = () => setShowDetails(prevState => !prevState);
  const {
    vitalsSignsConceptMetadata,
    conceptsUnits
  } = useVitalsSignsConceptMetaData();
  const [
    bloodPressureUnit,
    ,
    temperatureUnit,
    ,
    ,
    pulseUnit,
    oxygenationUnit,
    ,
    respiratoryRateUnit
  ] = conceptsUnits;

  React.useEffect(() => {
    if (patientUuid) {
      const subscription = performPatientsVitalsSearch(
        config.concepts,
        patientUuid,
        10
      ).subscribe(
        vitals => {
          setVital(first(vitals));
          setIsLoading(false);
        },
        error => {
          createErrorHandler();
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  useEffect(() => {
    if (vital && !dayjs(vital.date).isToday()) {
      setDisplayState({ view: "Warning" });
    }
    if (!isLoading && isEmpty(vital)) {
      setDisplayState({ view: "Warning" });
    }
  }, [vital, isLoading]);

  return (
    <>
      {!isLoading ? (
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
            vitals={vital}
          />
          {showDetails && (
            <>
              <div className={styles.row}>
                <VitalHeaderStateDetails
                  unitName={t("temperature", "Temp")}
                  unitSymbol="°C"
                  value={vital.temperature}
                />
                <VitalHeaderStateDetails
                  unitName={t("bp", "BP")}
                  unitSymbol="mmHg"
                  value={`${vital.systolic} / ${vital.diastolic}`}
                />
                <VitalHeaderStateDetails
                  unitName={t("heartRate", "Heart Rate")}
                  unitSymbol="bpm"
                  value={vital.pulse}
                />
                <VitalHeaderStateDetails
                  unitName={t("spo2", "SPO2")}
                  unitSymbol="%"
                  value={vital.oxygenSaturation}
                />
              </div>
              <div className={styles.row}>
                <VitalHeaderStateDetails
                  unitName={t("respiratoryRate", "R. Rate")}
                  unitSymbol="/ min"
                  value={vital.temperature}
                />
                <VitalHeaderStateDetails
                  unitName={t("height", "Height")}
                  unitSymbol="cm"
                  value={vital.height}
                />
                <VitalHeaderStateDetails
                  unitName={t("bmi", "BMI")}
                  unitSymbol={<span>kg / m²</span>}
                  value={vital.bmi}
                />
                <VitalHeaderStateDetails
                  unitName={t("weight", "Weight")}
                  unitSymbol="kg"
                  value={vital.weight}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <InlineLoading
          className={styles.loading}
          description={`${t("loading", "Loading")} ...`}
        />
      )}
    </>
  );
};

export default VitalHeader;
