import React, { useState, useEffect, useRef } from "react";
import { match, useRouteMatch, useHistory } from "react-router-dom";
import styles from "./vitals-form.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  getPatientsLatestVitals,
  savePatientVitals,
  editPatientVitals,
  getSession
} from "./vitals-card.resource";
import dayjs from "dayjs";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { difference } from "lodash-es";
import { DataCaptureComponentProps } from "../shared-utils";

export default function VitalsForm(props: VitalsFormProps) {
  const [enableButtons, setEnableButtons] = useState(false);
  const [formView, setFormView] = useState(true);
  const [patientVitals, setPatientVitals] = useState(null);
  const [updatedPatientVitals, setUpdatedPatientVitals] = useState([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [encounterProvider, setEncounterProvider] = useState(null);
  const [systolicBloodPressure, setSytolicBloodPressure] = useState(null);
  const [diastolicBloodPressure, setDiastolicBloodPressure] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [oxygenSaturation, setOxygenSaturation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [dateRecorded, setDateRecorded] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [timeRecorded, setTimeRecorded] = useState(
    dayjs(new Date()).format("HH:mm")
  );
  const [encounterUuid, setEncounterUuid] = useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const [currentSession, setCurrentSession] = useState();
  const [location, setLocation] = useState<string>(null);
  let history = useHistory();
  let match = useRouteMatch();
  const [formChange, setFormChanged] = useState<Boolean>(false);

  useEffect(() => {
    if (patientUuid && formView) {
      const abortController = new AbortController();
      getPatientsLatestVitals(patientUuid, abortController).then(response => {
        if (response.data.results.length > 0) {
          setDateRecorded(response.data.results[0].encounterDatetime);
          setTimeRecorded(response.data.results[0].encounterDatetime);
          setPatientVitals(response.data.results[0].obs);
          setUpdatedPatientVitals(response.data.results[0].obs);
          setEncounterUuid(response.data.results[0].uuid);
        }
      }, createErrorHandler());
      return () => abortController.signal;
    }

    if (patientUuid) {
      const abortController = new AbortController();
      getSession(abortController).then(response => {
        setEncounterProvider(response.data.currentProvider.uuid);
        setCurrentSession(response.data);
        setLocation(response.data.sessionLocation.uuid);
      }, createErrorHandler());
      return () => abortController.abort();
    }
  }, [formView, patientUuid]);

  useEffect(() => {
    const params: any = match.params;
    params.vitalsUuid ? setFormView(true) : setFormView(false);
  }, [match.params]);

  useEffect(() => {
    if (!formView) {
      if (
        systolicBloodPressure ||
        diastolicBloodPressure ||
        heartRate ||
        oxygenSaturation ||
        temperature ||
        weight ||
        (height && location)
      ) {
        setEnableButtons(false);
      } else {
        setEnableButtons(true);
      }
    }
  }, [
    systolicBloodPressure,
    diastolicBloodPressure,
    heartRate,
    oxygenSaturation,
    temperature,
    weight,
    height,
    dateRecorded,
    timeRecorded,
    formView,
    location
  ]);

  useEffect(() => {
    setEnableButtons(false);
  }, []);

  const handleEditInputChange = (uuid, value) => {
    setUpdatedPatientVitals(
      updatedPatientVitals.map(element => {
        if (element.uuid === uuid) {
          return { uuid: element.uuid, value: value };
        } else {
          return element;
        }
      })
    );
  };

  const handleCreateFormSubmit = event => {
    event.preventDefault();
    let Vitals: Vitals = {
      systolicBloodPressure: systolicBloodPressure,
      diastolicBloodPressure: diastolicBloodPressure,
      heartRate: heartRate,
      oxygenSaturation: oxygenSaturation,
      temperature: temperature,
      weight: weight,
      height: height
    };
    const abortController = new AbortController();
    savePatientVitals(
      patientUuid,
      Vitals,
      new Date(`${dateRecorded} ${timeRecorded}`),
      abortController,
      location
    ).then(response => {
      response.status === 201 && navigate();
    }, createErrorHandler());
    return () => abortController.abort();
  };

  function navigate() {
    history.push(`/patient/${patientUuid}/chart/results/overview`);
    props.closeComponent();
  }

  const handleEditFormSubmit = event => {
    event.preventDefault();
    const abortController = new AbortController();
    let Vitals: Vitals = {
      systolicBloodPressure: systolicBloodPressure,
      diastolicBloodPressure: diastolicBloodPressure,
      heartRate: heartRate,
      oxygenSaturation: oxygenSaturation,
      temperature: temperature,
      weight: weight,
      height: height
    };

    const editedVitals = difference(updatedPatientVitals, patientVitals);
    editPatientVitals(
      patientUuid,
      //@ts-ignore
      editedVitals,
      new Date(`${dateRecorded}`),
      abortController,
      encounterUuid,
      encounterProvider
    ).then(response => {
      response.status == 200 && navigate();
    }, createErrorHandler());
  };

  const closeVitalsForm = event => {
    let userConfirmed: boolean = false;
    if (formChange) {
      userConfirmed = confirm(
        "There is ongoing work, are you sure you want to close this tab?"
      );
    }

    if (userConfirmed && formChange) {
      props.closeComponent();
    } else if (!formChange) {
      props.closeComponent();
    }
  };

  function createVitals() {
    return (
      <form
        className={styles.vitalsForm}
        onSubmit={handleCreateFormSubmit}
        ref={formRef}
        onChange={() => {
          setFormChanged(true);
          return props.entryStarted();
        }}
      >
        <SummaryCard
          name="Add vitals, height and weight"
          styles={{
            width: "100%",
            backgroundColor: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          <div className={styles.vitalsContainerWrapper}>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              <div className={styles.vitalInputContainer}>
                <label htmlFor="dateRecorded">Date recorded</label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    id="dateRecorded"
                    name="dateRecorded"
                    className={styles.vitalInputControl}
                    required
                    onChange={evt => setDateRecorded(evt.target.value)}
                    value={dateRecorded}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>

              <div className={styles.vitalInputContainer}>
                <label
                  htmlFor="BloodPressure"
                  style={{ marginTop: "0.5rem", marginBottom: "0rem" }}
                >
                  Blood Pressure
                </label>
              </div>

              <div className={styles.vitalsContainer}>
                <div className={styles.vitalInputContainer}>
                  <label htmlFor="systolicBloodPressure">Systolic</label>
                  <div>
                    <input
                      type="number"
                      name="systolicBloodPressure"
                      id="d4d45a89-acef-4811-a3bb-989351d3fa90"
                      className={styles.vitalInputControl}
                      onChange={evt =>
                        setSytolicBloodPressure(evt.target.value)
                      }
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className={styles.vitalInputContainer}>
                  <span className={styles.forwardSlash}>&#47;</span>
                </div>

                <div className={styles.vitalInputContainer}>
                  <label htmlFor="diastolicBloodPressure">Diastolic</label>
                  <div>
                    <input
                      type="number"
                      name="diastolicBloodPressure"
                      id="b5a56b03-412d-4c5d-83d4-af7bfed69059"
                      className={styles.vitalInputControl}
                      onChange={evt =>
                        setDiastolicBloodPressure(evt.target.value)
                      }
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.vitalInputContainer}>
                <label htmlFor="heartRate">Heart Rate</label>
                <div>
                  <input
                    type="number"
                    name="heartRate"
                    id="heartRate"
                    className={styles.vitalInputControl}
                    onChange={evt => setHeartRate(evt.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={styles.vitalInputContainer}>
                <label htmlFor="oxygenSaturation">Oxygen saturation</label>
                <div>
                  <input
                    type="number"
                    name="oxygensaturation"
                    id="oxygenSaturation"
                    className={styles.vitalInputControl}
                    onChange={evt => setOxygenSaturation(evt.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={styles.vitalsContainer}>
                <div className={styles.vitalInputContainer} style={{ flex: 1 }}>
                  <label htmlFor="temperature">Temperature</label>
                  <div>
                    <input
                      type="number"
                      name="temperature"
                      id="temperature"
                      className={styles.vitalInputControl}
                      onChange={evt => setTemperature(evt.target.value)}
                      autoComplete="off"
                      step="any"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    flex: 1
                  }}
                >
                  <div className="toggleSwitch">
                    <input
                      type="radio"
                      name="toggleButton"
                      id="toggleButton1"
                      defaultChecked={true}
                    />
                    <label htmlFor="toggleButton1">Celsius</label>

                    <input
                      type="radio"
                      name="toggleButton"
                      id="toggleButton2"
                    />
                    <label htmlFor="toggleButton2">Fahrenheit</label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              <div className={styles.vitalInputContainer}>
                <label htmlFor="timeRecorded">Time recorded</label>
                <div className="omrs-datepicker">
                  <input
                    type="time"
                    id="timeRecorded"
                    name="timeRecorded"
                    className={styles.vitalInputControl}
                    required
                    onChange={evt => setTimeRecorded(evt.target.value)}
                    value={timeRecorded}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-access-time"></use>
                  </svg>
                </div>
              </div>

              <div
                className={styles.vitalsContainer}
                style={{ marginTop: "2.8rem" }}
              >
                <div className={styles.vitalInputContainer} style={{ flex: 1 }}>
                  <label htmlFor="weight">Weight</label>
                  <div>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      className={styles.vitalInputControl}
                      onChange={evt => setWeight(evt.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    flex: 1
                  }}
                >
                  <div className="toggleSwitch">
                    <input
                      type="radio"
                      name="toggleWeight"
                      id="toggleWeight1"
                      defaultChecked={true}
                    />
                    <label htmlFor="toggleWeight1">kg</label>

                    <input
                      type="radio"
                      name="toggleWeight"
                      id="toggleWeight2"
                    />
                    <label htmlFor="toggleWeight2">lbs</label>
                  </div>
                </div>
              </div>

              <div className={styles.vitalsContainer}>
                <div className={styles.vitalInputContainer} style={{ flex: 1 }}>
                  <label htmlFor="height">Height</label>
                  <div>
                    <input
                      type="Number"
                      name="height"
                      id="height"
                      className={styles.vitalInputControl}
                      onChange={evt => setHeight(evt.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    flex: 1
                  }}
                >
                  <div className="toggleSwitch">
                    <input
                      type="radio"
                      name="toggleHeight"
                      id="toggleHeight1"
                      defaultChecked={true}
                    />
                    <label htmlFor="toggleHeight1">cm</label>

                    <input
                      type="radio"
                      name="toggleHeight"
                      id="toggleHeight2"
                    />
                    <label htmlFor="toggleHeight2">feet</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SummaryCard>
        <div
          className={
            enableButtons
              ? styles.buttonStyles
              : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
          }
        >
          <button
            type="button"
            className="omrs-btn omrs-outlined-neutral omrs-rounded"
            style={{ width: "50%" }}
            onClick={closeVitalsForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ width: "50%" }}
            className={
              enableButtons
                ? "omrs-btn omrs-outlined omrs-rounded"
                : "omrs-btn omrs-filled-action omrs-rounded"
            }
            disabled={enableButtons}
          >
            Sign & Save
          </button>
        </div>
      </form>
    );
  }

  function editVitals() {
    return (
      <form
        className={styles.vitalsForm}
        ref={formRef}
        onSubmit={handleEditFormSubmit}
      >
        <SummaryCard
          name="Edit Vitals"
          styles={{
            width: "100%",
            backgroundColor: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          {patientVitals && (
            <div className={styles.vitalsContainerWrapper}>
              <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                <div className={styles.vitalInputContainer}>
                  <label htmlFor="dateRecorded">Date recorded</label>
                  <div className="omrs-datepicker">
                    <input
                      type="date"
                      name="dateRecorded"
                      id="dateRecorded"
                      className={styles.vitalInputControl}
                      defaultValue={dayjs(dateRecorded).format("YYYY-MM-DD")}
                      onChange={evt => setDateRecorded(evt.target.value)}
                    />
                    <svg className="omrs-icon" role="img">
                      <use xlinkHref="#omrs-icon-calendar"></use>
                    </svg>
                  </div>
                </div>

                <div className={styles.vitalInputContainer}>
                  <label
                    htmlFor="BloodPressure"
                    style={{ marginTop: "0.5rem", marginBottom: "0rem" }}
                  >
                    Blood Pressure
                  </label>
                </div>

                <div className={styles.vitalsContainer}>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="systolic">Systolic</label>
                    <div>
                      <input
                        type="number"
                        name="systolicBloodPressure"
                        id={patientVitals[6].uuid}
                        className={styles.vitalInputControl}
                        defaultValue={patientVitals[6].value}
                        required
                        onChange={evt =>
                          handleEditInputChange(evt.target.id, evt.target.value)
                        }
                      />
                      <span>mmHg</span>
                    </div>
                  </div>

                  <div className={styles.vitalInputContainer}>
                    <span className={styles.forwardSlash}>&#47;</span>
                  </div>

                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="diastolic">Diastolic</label>
                    <div>
                      <input
                        type="number"
                        name="diastolicBloodPressure"
                        id={patientVitals[5].uuid}
                        className={styles.vitalInputControl}
                        defaultValue={patientVitals[5].value}
                        required
                        onChange={evt =>
                          handleEditInputChange(evt.target.id, evt.target.value)
                        }
                      />
                      <span>mmHg</span>
                    </div>
                  </div>
                </div>

                <div className={styles.vitalInputContainer}>
                  <label htmlFor="heartRate">Heart Rate</label>
                  <div>
                    <input
                      type="number"
                      name="heartRate"
                      id={patientVitals[4].uuid}
                      className={styles.vitalInputControl}
                      defaultValue={patientVitals[4].value}
                      required
                      onChange={evt =>
                        handleEditInputChange(evt.target.id, evt.target.value)
                      }
                    />
                    <span>bpm</span>
                  </div>
                </div>

                <div className={styles.vitalInputContainer}>
                  <label htmlFor="oxygenSaturation">Oxygen saturation</label>
                  <div>
                    <input
                      type="number"
                      name="oxygensaturation"
                      id={patientVitals[1].uuid}
                      className={styles.vitalInputControl}
                      defaultValue={patientVitals[1].value}
                      required
                      onChange={evt =>
                        handleEditInputChange(evt.target.id, evt.target.value)
                      }
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className={styles.vitalsContainer}>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="temperature">Temperature</label>
                    <div>
                      <input
                        type="number"
                        name="temperature"
                        id={patientVitals[2].uuid}
                        className={styles.vitalInputControl}
                        defaultValue={patientVitals[2].value}
                        required
                        onChange={evt =>
                          handleEditInputChange(evt.target.id, evt.target.value)
                        }
                      />
                      <span>&#8451;</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "1rem",
                      marginLeft: "1rem"
                    }}
                  >
                    <div className="toggleSwitch">
                      <input
                        type="radio"
                        name="toggleButton"
                        id="toggleButton1"
                        defaultChecked={true}
                      />
                      <label htmlFor="toggleButton1">Celsius</label>

                      <input
                        type="radio"
                        name="toggleButton"
                        id="toggleButton2"
                      />
                      <label htmlFor="toggleButton2">Fahrenheit</label>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                <div className={styles.vitalInputContainer}>
                  <label htmlFor="timeRecorded">Time recorded</label>
                  <div className="omrs-datepicker">
                    <input
                      type="time"
                      name="timeRecorded"
                      className={styles.vitalInputControl}
                      defaultValue={dayjs(timeRecorded).format("HH:MM")}
                      onChange={evt => setTimeRecorded(evt.target.value)}
                    />
                    <svg className="omrs-icon" role="img">
                      <use xlinkHref="#omrs-icon-access-time"></use>
                    </svg>
                  </div>
                </div>

                <div
                  className={styles.vitalsContainer}
                  style={{ marginTop: "2.8rem" }}
                >
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="weight">Weight</label>
                    <div>
                      <input
                        type="number"
                        name="weight"
                        id={patientVitals[0].uuid}
                        className={styles.vitalInputControl}
                        defaultValue={patientVitals[0].value}
                        required
                        onChange={evt =>
                          handleEditInputChange(evt.target.id, evt.target.value)
                        }
                      />
                      <span>kg</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "1rem",
                      marginLeft: "1rem"
                    }}
                  >
                    <div className="toggleSwitch">
                      <input
                        type="radio"
                        name="toggleWeight"
                        id="toggleWeight1"
                        defaultChecked={true}
                      />
                      <label htmlFor="toggleWeight1">kg</label>

                      <input
                        type="radio"
                        name="toggleWeight"
                        id="toggleWeight2"
                      />
                      <label htmlFor="toggleWeight2">lbs</label>
                    </div>
                  </div>
                </div>

                <div className={styles.vitalsContainer}>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="systolic">Height</label>
                    <div>
                      <input
                        type="number"
                        name="height"
                        id={patientVitals[3].uuid}
                        className={styles.vitalInputControl}
                        defaultValue={patientVitals[3].value}
                        required
                        onChange={evt =>
                          handleEditInputChange(evt.target.id, evt.target.value)
                        }
                      />
                      <span>cm</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "1rem",
                      marginLeft: "1rem"
                    }}
                  >
                    <div className="toggleSwitch">
                      <input
                        type="radio"
                        name="toggleHeight"
                        id="toggleHeight1"
                        defaultChecked={true}
                      />
                      <label htmlFor="toggleHeight1">cm</label>

                      <input
                        type="radio"
                        name="toggleHeight"
                        id="toggleHeight2"
                      />
                      <label htmlFor="toggleHeight2">feet</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SummaryCard>
        <div
          className={
            enableButtons
              ? styles.buttonStyles
              : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
          }
        >
          <button
            type="button"
            className="omrs-btn omrs-outlined-neutral omrs-rounded"
            style={{ width: "20%" }}
          >
            Delete
          </button>

          <button
            type="button"
            className="omrs-btn omrs-outlined-neutral omrs-rounded"
            style={{ width: "30%" }}
            onClick={closeVitalsForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={
              enableButtons
                ? "omrs-btn omrs-outlined omrs-rounded"
                : "omrs-btn omrs-filled-action omrs-rounded"
            }
            disabled={enableButtons}
            style={{ width: "50%" }}
          >
            Sign & Save
          </button>
        </div>
      </form>
    );
  }

  return <div>{formView ? editVitals() : createVitals()}</div>;
}
VitalsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

type VitalsFormProps = DataCaptureComponentProps & { match: match };

export type Vitals = {
  height: number;
  weight: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  temperature: number;
  oxygenSaturation: number;
  heartRate: number;
};
