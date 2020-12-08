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

export interface PatientVitalAndBiometric {
  systolicBloodPressure: string;
  diastolicBloodPressure: string;
  heartRate: string;
  spo2: string;
  respiratoryRate: string;
  generalPatientNote: string;
  weight?: string;
  height?: string;
  temperature?: string;
  midUpperArmCircumference?: string;
}

const VitalsAndBiometricForms: React.FC<VitalsAndBiometricFormProps> = ({
  closeWorkspace
}) => {
  closeWorkspace = closeWorkspace ?? (() => switchTo("workspace", ""));
  const session = useSessionUser();
  const config = useConfig();
  const [, , patientUuid] = useCurrentPatient();
  const [patientVitalAndBiometrics, setPatientVitalAndBiometrics] = useState<
    PatientVitalAndBiometric
  >();
  const [patientBMI, setPatientBMI] = useState<number>();
  useEffect(() => {
    if (
      patientVitalAndBiometrics?.height &&
      patientVitalAndBiometrics?.weight
    ) {
      const calculatedBmi = calculateBMI(
        Number(patientVitalAndBiometrics.weight),
        Number(patientVitalAndBiometrics.height)
      );
      setPatientBMI(calculatedBmi);
    }
  }, [patientVitalAndBiometrics?.weight, patientVitalAndBiometrics?.height]);

  const vitalsUnitSymbols = config.vitals;
  const biometricsUnitsSymbols = config.biometrics;

  const savePatientVitalsAndBiometrics = () => {
    const ac = new AbortController();
    savePatientVitals(
      config.vitals.encounterTypeUuid,
      config.vitals.formUuid,
      config.concepts,
      patientUuid,
      patientVitalAndBiometrics,
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
    if (value === undefined || value === "") return false;
    return !(
      value >= normalConceptsValueRange.concepts[conceptName]?.min &&
      value <= normalConceptsValueRange.concepts[conceptName]?.max
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
                  ? setPatientVitalAndBiometrics({
                      ...patientVitalAndBiometrics,
                      systolicBloodPressure: event.target.value
                    })
                  : setPatientVitalAndBiometrics({
                      ...patientVitalAndBiometrics,
                      diastolicBloodPressure: event.target.value
                    });
              }}
              textFields={[
                {
                  name: "systolic",
                  separator: "/",
                  type: "text",
                  value: patientVitalAndBiometrics?.systolicBloodPressure || ""
                },
                {
                  name: "diastolic",
                  type: "text",
                  value: patientVitalAndBiometrics?.diastolicBloodPressure || ""
                }
              ]}
              unitSymbol={vitalsUnitSymbols["bloodPressureUnit"]}
              isValidRange={
                isValidRange(
                  patientVitalAndBiometrics?.systolicBloodPressure,
                  "systolicBloodPressureUuid"
                ) ||
                isValidRange(
                  patientVitalAndBiometrics?.diastolicBloodPressure,
                  "diastolicBloodPressureUuid"
                )
              }
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Heart Rate"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  heartRate: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Heart Rate",
                  type: "text",
                  value: patientVitalAndBiometrics?.heartRate || ""
                }
              ]}
              unitSymbol={vitalsUnitSymbols["pulseUnit"]}
              isValidRange={isValidRange(
                patientVitalAndBiometrics?.heartRate,
                "heartRateUuid"
              )}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Sp02"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  spo2: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Sp02",
                  type: "text",
                  value: patientVitalAndBiometrics?.spo2 || ""
                }
              ]}
              unitSymbol={vitalsUnitSymbols["oxygenSaturationUnit"]}
              isValidRange={isValidRange(
                patientVitalAndBiometrics?.spo2,
                "spo2Uuid"
              )}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Respiration Rate"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  respiratoryRate: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Respiration Rate",
                  type: "text",
                  value: patientVitalAndBiometrics?.respiratoryRate || ""
                }
              ]}
              unitSymbol={vitalsUnitSymbols["respiratoryRateUnit"]}
              isValidRange={isValidRange(
                patientVitalAndBiometrics?.respiratoryRate,
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
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  temperature: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Temparute",
                  type: "text",
                  value: patientVitalAndBiometrics?.temperature || ""
                }
              ]}
              unitSymbol={vitalsUnitSymbols["temperatureUnit"]}
              isValidRange={isValidRange(
                patientVitalAndBiometrics?.temperature,
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
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  generalPatientNote: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Notes",
                  type: "textArea",
                  value: patientVitalAndBiometrics?.generalPatientNote || ""
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
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  weight: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Weight",
                  type: "text",
                  value: patientVitalAndBiometrics?.weight || ""
                }
              ]}
              unitSymbol={biometricsUnitsSymbols["weightUnit"]}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Height"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  height: event.target.value
                });
              }}
              textFields={[
                {
                  name: "Height",
                  type: "text",
                  value: patientVitalAndBiometrics?.height || ""
                }
              ]}
              unitSymbol={biometricsUnitsSymbols["heightUnit"]}
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
                  value: patientBMI || ""
                }
              ]}
              unitSymbol={biometricsUnitsSymbols["bmiUnit"]}
              disabled={true}
              isValidRange={isValidRange(patientBMI, "bmi")}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="MUAC"
              onInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVitalAndBiometrics({
                  ...patientVitalAndBiometrics,
                  midUpperArmCircumference: event.target.value
                });
              }}
              textFields={[
                {
                  name: "muac",
                  type: "text",
                  value:
                    patientVitalAndBiometrics?.midUpperArmCircumference || ""
                }
              ]}
              unitSymbol={vitalsUnitSymbols["midUpperArmCircumferenceUnit"]}
              isValidRange={isValidRange(
                patientVitalAndBiometrics?.midUpperArmCircumference,
                "midUpperArmCircumference"
              )}
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
