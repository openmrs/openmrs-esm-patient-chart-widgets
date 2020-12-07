import React, { useEffect, useState } from "react";
import { switchTo } from "@openmrs/esm-extensions";
import VitalsBiometricInput from "./vitals-biometrics-input.component";
import { BrowserRouter } from "react-router-dom";
import { Button, Column, Grid, Row } from "carbon-components-react";
import styles from "./vitals-biometrics-form.component.scss";
import { calculateBMI } from "./vitals-biometrics-form.utils";
import useSessionUser from "../../../utils/use-session-user";
import { useConfig, useCurrentPatient } from "@openmrs/esm-react-utils";
import { savePatientVitals } from "../vitals-biometrics.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";

interface VitalsAndBiometricFormProps {
  closeWorkspace?: () => void;
}

const normalConceptsValueRange = {
  concepts: {
    systolicBloodPressureUuid: { max: 120, min: 110 },
    diastolicBloodPressureUuid: { max: 80, min: 75 },
    heartRateUuid: { max: 100, min: 60 },
    temperatureUuid: { max: 37.5, min: 36.5 },
    spo2Uuid: { max: 100, min: 95 },
    respiratoryRateUuid: { max: 20, min: 12 },
    bmi: { max: 24.9, min: 18.5 },
    midUpperArmCircumference: { max: 25.5, min: 23 }
  }
};

export interface patientVitalAndBiometric {
  systolicBloodPressure: string;
  diastolicBloodPressure: string;
  heartRate: string;
  spo2: string;
  respiratoryRate: string;
  generalPatientNote: string;
  weight?: string;
  height?: string;
  temperature?: string;
  muac?: string;
}

const VitalsAndBiometricForms: React.FC<VitalsAndBiometricFormProps> = ({
  closeWorkspace
}) => {
  closeWorkspace = closeWorkspace ?? (() => switchTo("workspace", ""));
  const session = useSessionUser();
  const config = useConfig();
  const [, , patientUuid] = useCurrentPatient();
  const [patientVital, setPatientVital] = useState<patientVitalAndBiometric>();
  const [patientBMI, setPatientBMI] = useState<number>();
  useEffect(() => {
    if (patientVital?.height && patientVital?.weight) {
      const calculatedBmi = calculateBMI(
        Number(patientVital.weight),
        Number(patientVital.height)
      );
      setPatientBMI(calculatedBmi);
    }
  }, [patientVital?.weight, patientVital?.height]);

  const savePatientVitalsAndBiometrics = () => {
    const ac = new AbortController();
    savePatientVitals(
      config.vitals.encounterTypeUuid,
      config.vitals.formUuid,
      config.concepts,
      patientUuid,
      patientVital,
      new Date(),
      ac,
      session.sessionLocation.uuid
    ).then(response => {
      response.status === 201 && closeWorkspace();
      response.status !== 201 && createErrorHandler();
    });
    return () => ac.abort();
  };

  const isValidRange = (value, conceptName) => {
    if (value === undefined) return false;
    return !(
      value >= normalConceptsValueRange.concepts[conceptName].min &&
      value <= normalConceptsValueRange.concepts[conceptName].max
    );
  };

  const handleCancel = () => {
    closeWorkspace();
  };

  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Grid condensed className={styles.vitalsBiometricContainer}>
        <Row>
          <Column>
            <p className={styles.vitalsTitle}>Vitals</p>
          </Column>
        </Row>
        <Row>
          <Column>
            <VitalsBiometricInput
              title="Blood Pressure"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.target.name === "systolic"
                  ? setPatientVital({
                      ...patientVital,
                      systolicBloodPressure: event.target.value
                    })
                  : setPatientVital({
                      ...patientVital,
                      diastolicBloodPressure: event.target.value
                    });
              }}
              textFields={[
                {
                  name: "systolic",
                  separator: "/",
                  type: "text",
                  value: patientVital?.systolicBloodPressure
                },
                {
                  name: "diastolic",
                  type: "text",
                  value: patientVital?.diastolicBloodPressure
                }
              ]}
              unitSymbol="mmHg"
              isValidRange={
                isValidRange(
                  patientVital?.systolicBloodPressure,
                  "systolicBloodPressureUuid"
                ) ||
                isValidRange(
                  patientVital?.diastolicBloodPressure,
                  "diastolicBloodPressureUuid"
                )
              }
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Heart Rate"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  heartRate: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Heart Rate",
                  type: "text",
                  value: patientVital?.heartRate
                }
              ]}
              unitSymbol="bpm"
              isValidRange={isValidRange(
                patientVital?.heartRate,
                "heartRateUuid"
              )}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Sp02"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  spo2: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Sp02",
                  type: "text",
                  value: patientVital?.spo2
                }
              ]}
              unitSymbol="%"
              isValidRange={isValidRange(patientVital?.spo2, "spo2Uuid")}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Respiration Rate"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  respiratoryRate: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Respiration Rate",
                  type: "text",
                  value: patientVital?.respiratoryRate
                }
              ]}
              unitSymbol="/ min"
              isValidRange={isValidRange(
                patientVital?.respiratoryRate,
                "respiratoryRateUuid"
              )}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <VitalsBiometricInput
              title="Temp"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  temperature: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Temparute",
                  type: "text",
                  value: patientVital?.temperature
                }
              ]}
              unitSymbol="°C"
              isValidRange={isValidRange(
                patientVital?.temperature,
                "temperatureUuid"
              )}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <VitalsBiometricInput
              title="Notes"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  generalPatientNote: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Notes",
                  type: "textArea",
                  value: patientVital?.generalPatientNote
                }
              ]}
              textFieldWidth="26.375rem"
              placeholder="Type any additional notes here"
            />
          </Column>
        </Row>

        <Row>
          <Column>
            <p className={styles.vitalsTitle}>Biometrics</p>
          </Column>
        </Row>
        <Row>
          <Column>
            <VitalsBiometricInput
              title="Weight"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  weight: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Weight",
                  type: "text",
                  value: patientVital?.weight
                }
              ]}
              unitSymbol="kg"
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Height"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  height: event.target.value
                });
              }}
              textFields={[
                { name: "Height", type: "text", value: patientVital?.height }
              ]}
              unitSymbol="cm"
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="BMI(calc.)"
              onInputChange={() => {}}
              textFields={[
                {
                  name: "bmi",
                  type: "text",
                  value: patientBMI
                }
              ]}
              unitSymbol="kg / m2"
              disabled={true}
              isValidRange={isValidRange(patientBMI, "bmi")}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="MUAC"
              onInputChange={() => {}}
              textFields={[
                {
                  name: "muac",
                  type: "text",
                  value: patientVital?.muac
                }
              ]}
              unitSymbol="cm"
              isValidRange={isValidRange(patientVital?.muac, "muac")}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Button
              onClick={handleCancel}
              className={styles.vitalsButton}
              kind="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={savePatientVitalsAndBiometrics}
              className={styles.vitalsButton}
              kind="primary"
            >
              Sign & Save
            </Button>
          </Column>
        </Row>
      </Grid>
    </BrowserRouter>
  );
};

export default VitalsAndBiometricForms;
