import React, { useEffect, useState } from "react";
import { switchTo } from "@openmrs/esm-extensions";
import VitalsBiometricInput from "./vitals-biometric-input.component";
import { BrowserRouter } from "react-router-dom";
import { Button, ButtonSet, Column, Grid, Row } from "carbon-components-react";
import styles from "./vitals-biometric-form.component.scss";
import { calculateBMI } from "./vitals-biometric-form.utils";
import useSessionUser from "../../../utils/use-session-user";
import { useConfig, useCurrentPatient } from "@openmrs/esm-react-utils";
import { savePatientVitals } from "../vitals-biometrics.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";

interface VitalsAndBiometricFormProps {
  closeWorkspace?: () => void;
}

export interface patientVitalAndBiometric {
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  heartRate: number;
  spo2: number;
  respiratoryRate: number;
  generalPatientNote: string;
  weight?: number;
  height?: number;
  temperature?: string;
}

const VitalsAndBiometricForm: React.FC<VitalsAndBiometricFormProps> = ({
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.target.name === "systolic"
                  ? setPatientVital({
                      ...patientVital,
                      systolicBloodPressure: Number(event.target.value)
                    })
                  : setPatientVital({
                      ...patientVital,
                      diastolicBloodPressure: Number(event.target.value)
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
              textFieldStyles={{ color: "red" }}
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Heart Rate"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  heartRate: Number(event.target.value)
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
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Sp02"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  spo2: Number(event.target.value)
                });
              }}
              textFields={[
                { name: "Sp02", type: "text", value: patientVital?.spo2 }
              ]}
              unitSymbol="%"
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Respiration Rate"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  respiratoryRate: Number(event.target.value)
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
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <VitalsBiometricInput
              title="Temp"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <VitalsBiometricInput
              title="Notes"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  weight: Number(event.target.value)
                });
              }}
              textFields={[
                { name: "Weight", type: "text", value: patientVital?.weight }
              ]}
              unitSymbol="kg"
            />
          </Column>
          <Column>
            <VitalsBiometricInput
              title="Height"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPatientVital({
                  ...patientVital,
                  height: Number(event.target.value)
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
              onChange={() => {}}
              textFields={[
                {
                  name: "bmi",
                  type: "text",
                  value: patientBMI
                }
              ]}
              unitSymbol="kg / m2"
              disabled={true}
            />
          </Column>
        </Row>
        <Row>
          <Column style={{ marginTop: "2rem", marginLeft: ".5rem" }}>
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

export default VitalsAndBiometricForm;
