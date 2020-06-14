import React, { useEffect, useRef, useState, SyntheticEvent } from "react";
import { useTranslation, Trans } from "react-i18next";
import { match, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { useCurrentPatient } from "@openmrs/esm-api";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { ConfigObject } from "../../config-schema";
import withConfig from "../../with-config";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { DataCaptureComponentProps } from "../shared-utils";
import {
  editPatientVitals,
  getSession,
  PatientVitals,
  performPatientsVitalsSearch,
  savePatientVitals
} from "./vitals-card.resource";
import styles from "./vitals-form.css";

function VitalsForm(props: VitalsFormProps) {
  const [enableCreateButtons, setEnableCreateButtons] = useState(false);
  const [enableEditButtons, setEnableEditButtons] = useState(false);
  const [viewEditForm, setViewEditForm] = useState(false);
  const [patientVitals, setPatientVitals] = useState<PatientVitals>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [, setEncounterProvider] = useState(null);
  const [systolicBloodPressure, setSytolicBloodPressure] = useState(null);
  const [diastolicBloodPressure, setDiastolicBloodPressure] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [oxygenSaturation, setOxygenSaturation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [dateRecorded, setDateRecorded] = useState(
    dayjs.utc(new Date()).format("YYYY-MM-DD")
  );
  const [timeRecorded, setTimeRecorded] = useState(
    dayjs.utc(new Date()).format("HH:mm")
  );
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const [, setCurrentSession] = useState();
  const [location, setLocation] = useState<string>(null);
  const [formChanged, setFormChanged] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (props.match.params["vitalUuid"]) {
      setViewEditForm(true);
    }
  }, [props.match.params]);

  useEffect(() => {
    if (patientUuid && !isLoadingPatient && viewEditForm) {
      performPatientsVitalsSearch(props.config.concepts, patientUuid).subscribe(
        vitals => {
          const vitalSigns: PatientVitals = vitals.find(
            vital => vital.id === props.match.params["vitalUuid"]
          );
          setPatientVitals(vitalSigns);
          setTemperature(vitalSigns?.temperature);
          setSytolicBloodPressure(vitalSigns?.systolic);
          setDiastolicBloodPressure(vitalSigns?.diastolic);
          setTimeRecorded(vitalSigns?.date.toString());
          setOxygenSaturation(vitalSigns?.oxygenSaturation);
          setPulse(vitalSigns?.pulse);
          setDateRecorded(vitalSigns?.date.toString());
          setHeight(vitalSigns?.height);
          setWeight(vitalSigns?.weight);
        },
        createErrorHandler()
      );
    }
  }, [
    props.config.concepts,
    patientUuid,
    isLoadingPatient,
    props.match.params,
    viewEditForm
  ]);

  useEffect(() => {
    if (patientUuid && !isLoadingPatient) {
      const abortController = new AbortController();
      getSession(abortController)
        .then(response => {
          const { data } = response;
          setEncounterProvider(data?.currentProvider?.uuid);
          setCurrentSession(data);
          setLocation(data?.sessionLocation?.uuid);
        })
        .catch(createErrorHandler());
      return () => abortController.abort();
    }
  }, [patientUuid, isLoadingPatient]);

  useEffect(() => {
    if (!viewEditForm) {
      if (
        systolicBloodPressure ||
        diastolicBloodPressure ||
        pulse ||
        oxygenSaturation ||
        temperature ||
        weight ||
        (height && location)
      ) {
        setEnableCreateButtons(true);
      } else {
        setEnableCreateButtons(false);
      }
    }
  }, [
    viewEditForm,
    systolicBloodPressure,
    diastolicBloodPressure,
    pulse,
    oxygenSaturation,
    temperature,
    weight,
    height,
    dateRecorded,
    timeRecorded,
    location
  ]);

  useEffect(() => {
    if (viewEditForm && formChanged) {
      setEnableEditButtons(true);
    } else {
      setEnableEditButtons(false);
    }
  }, [viewEditForm, formChanged]);

  const handleCreateFormSubmit = (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const vitals: Vitals = {
      systolicBloodPressure,
      diastolicBloodPressure,
      pulse,
      oxygenSaturation,
      temperature,
      weight,
      height
    };
    const abortController = new AbortController();
    savePatientVitals(
      props.config.vitals.encounterTypeUuid,
      props.config.vitals.formUuid,
      props.config.concepts,
      patientUuid,
      vitals,
      new Date(`${dateRecorded} ${timeRecorded}`),
      abortController,
      location
    )
      .then(response => {
        response.status === 201 && navigate();
      })
      .catch(createErrorHandler());
    return () => abortController.abort();
  };

  const navigate = () => {
    history.push(`/patient/${patientUuid}/chart/results/overview`);
    props.closeComponent();
  };

  const closeVitalsForm = (event: SyntheticEvent<HTMLButtonElement>) => {
    let userConfirmed: boolean = false;
    if (formChanged) {
      userConfirmed = confirm(
        "There is ongoing work, are you sure you want to close this tab?"
      );
    }

    if (userConfirmed && formChanged) {
      props.closeComponent();
    } else if (!formChanged) {
      props.closeComponent();
    }
  };

  const handleEditFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const vitals: Vitals = {
      systolicBloodPressure,
      diastolicBloodPressure,
      pulse,
      oxygenSaturation,
      temperature,
      weight,
      height
    };
    const ac = new AbortController();
    editPatientVitals(
      props.config.concepts,
      patientUuid,
      vitals,
      dayjs(dateRecorded).toDate(),
      ac,
      props.match.params["vitalUuid"],
      location
    ).then(response => {
      response.status === 200 && props.closeComponent();
    });
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
          name={t("Add vitals, height and weight")}
          styles={{
            width: "100%",
            backgroundColor: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          <div className={styles.vitalsContainerWrapper}>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              <div className={styles.vitalInputContainer}>
                <label htmlFor="dateRecorded">
                  <Trans i18nKey="dateRecorded">Date recorded</Trans>
                </label>
                <div className="omrs-datepicker">
                  <input
                    id="dateRecorded"
                    type="date"
                    name="dateRecorded"
                    className={styles.vitalInputControl}
                    onChange={evt => setDateRecorded(evt.target.value)}
                    value={dateRecorded}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.vitalInputContainer}>
                <div className={styles.bpHeader}>
                  <Trans i18nKey="bloodPressure">Blood pressure</Trans>
                </div>
              </div>
              <div className={styles.vitalsContainer}>
                <div className={styles.vitalInputContainer}>
                  <label htmlFor="systolicBloodPressure">
                    <Trans i18nKey="systolic">Systolic</Trans>
                  </label>
                  <div>
                    <input
                      id="systolicBloodPressure"
                      type="number"
                      name="systolicBloodPressure"
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
                  <label htmlFor="diastolicBloodPressure">
                    <Trans i18nKey="diastolic">Diastolic</Trans>
                  </label>
                  <div>
                    <input
                      id="diastolicBloodPressure"
                      type="number"
                      name="diastolicBloodPressure"
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
                <label htmlFor="heartRate">
                  <Trans i18nKey="heartRate">Heart rate</Trans>
                </label>
                <div>
                  <input
                    id="heartRate"
                    type="number"
                    name="heartRate"
                    className={styles.vitalInputControl}
                    onChange={evt => setPulse(evt.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className={styles.vitalInputContainer}>
                <label htmlFor="oxygenSaturation">
                  <Trans i18nKey="oxygenSaturation">Oxygen saturation</Trans>
                </label>
                <div>
                  <input
                    id="oxygenSaturation"
                    type="number"
                    name="oxygensaturation"
                    className={styles.vitalInputControl}
                    onChange={evt => setOxygenSaturation(evt.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className={styles.vitalsContainer}>
                <div className={styles.vitalInputContainer} style={{ flex: 1 }}>
                  <label htmlFor="temperature">
                    <Trans i18nKey="temperature">Temperature</Trans>
                  </label>
                  <div>
                    <input
                      id="temperature"
                      type="number"
                      name="temperature"
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
                      id="toggleButton1"
                      type="radio"
                      name="toggleButton"
                      defaultChecked={true}
                    />
                    <label htmlFor="toggleButton1">
                      <Trans i18nKey="celsius">Celsius</Trans>
                    </label>
                    <input
                      type="radio"
                      name="toggleButton"
                      id="toggleButton2"
                    />
                    <label htmlFor="toggleButton2">
                      <Trans i18nKey="fahrenheit">Fahrenheit</Trans>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              <div className={styles.vitalInputContainer}>
                <label htmlFor="timeRecorded">
                  <Trans i18nKey="timeRecorded">Time recorded</Trans>
                </label>
                <div className="omrs-datepicker">
                  <input
                    id="timeRecorded"
                    type="time"
                    name="timeRecorded"
                    className={styles.vitalInputControl}
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
                  <label htmlFor="weight">
                    <Trans i18nKey="weight">Weight</Trans>
                  </label>
                  <div>
                    <input
                      id="weight"
                      type="number"
                      name="weight"
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
                      id="toggleWeight1"
                      type="radio"
                      name="toggleWeight"
                      defaultChecked={true}
                    />
                    <label htmlFor="toggleWeight1">
                      <Trans i18nKey="kg">kg</Trans>
                    </label>
                    <input
                      id="toggleWeight2"
                      type="radio"
                      name="toggleWeight"
                    />
                    <label htmlFor="toggleWeight2">
                      <Trans i18nKey="lbs">lbs</Trans>
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.vitalsContainer}>
                <div className={styles.vitalInputContainer} style={{ flex: 1 }}>
                  <label htmlFor="height">Height</label>
                  <div>
                    <input
                      id="height"
                      type="Number"
                      name="height"
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
                      id="toggleHeight1"
                      type="radio"
                      name="toggleHeight"
                      defaultChecked={true}
                    />
                    <label htmlFor="toggleHeight1">
                      <Trans i18nKey="cm">cm</Trans>
                    </label>
                    <input
                      id="toggleHeight2"
                      type="radio"
                      name="toggleHeight"
                    />
                    <label htmlFor="toggleHeight2">
                      <Trans i18nKey="feet">feet</Trans>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SummaryCard>
        <div
          className={
            enableCreateButtons
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
            <Trans i18nKey="cancel">Cancel</Trans>
          </button>
          <button
            type="submit"
            style={{ width: "50%" }}
            className={
              enableCreateButtons
                ? "omrs-btn omrs-filled-action omrs-rounded"
                : "omrs-btn omrs-outlined omrs-rounded"
            }
            disabled={!enableCreateButtons}
          >
            <Trans i18nKey="signAndSave">Sign & Save</Trans>
          </button>
        </div>
      </form>
    );
  }

  function editVitals() {
    return (
      <>
        {!!patientVitals && (
          <SummaryCard
            name={t("Edit vitals")}
            styles={{
              width: "100%",
              backgroundColor: "var(--omrs-color-bg-medium-contrast)",
              height: "auto"
            }}
          >
            <form
              className={styles.vitalsForm}
              ref={formRef}
              onSubmit={handleEditFormSubmit}
              onChange={() => {
                setFormChanged(true);
                return props.entryStarted();
              }}
            >
              <div className={styles.vitalsContainerWrapper}>
                <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="dateRecorded">
                      <Trans i18nKey="dateRecorded">Date recorded</Trans>
                    </label>
                    <div className="omrs-datepicker">
                      <input
                        type="date"
                        name="dateRecorded"
                        id="dateRecorded"
                        className={styles.vitalInputControl}
                        value={dayjs(dateRecorded).format("YYYY-MM-DD")}
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
                      <Trans i18nKey="bloodPressure">Blood pressure</Trans>
                    </label>
                  </div>
                  <div className={styles.vitalsContainer}>
                    <div className={styles.vitalInputContainer}>
                      <label htmlFor="systolic">
                        <Trans i18nKey="systolic">Systolic</Trans>
                      </label>
                      <div>
                        <input
                          id="systolic"
                          type="number"
                          name="systolicBloodPressure"
                          className={styles.vitalInputControl}
                          value={systolicBloodPressure}
                          onChange={evt =>
                            setSytolicBloodPressure(evt.target.value)
                          }
                        />
                        <span>mmHg</span>
                      </div>
                    </div>
                    <div className={styles.vitalInputContainer}>
                      <span className={styles.forwardSlash}>&#47;</span>
                    </div>
                    <div className={styles.vitalInputContainer}>
                      <label htmlFor="diastolic">
                        <Trans i18nKey="diastolic">Diastolic</Trans>
                      </label>
                      <div>
                        <input
                          id="diastolic"
                          type="number"
                          name="diastolicBloodPressure"
                          className={styles.vitalInputControl}
                          value={diastolicBloodPressure}
                          onChange={evt =>
                            setDiastolicBloodPressure(evt.target.value)
                          }
                        />
                        <span>mmHg</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="heartRate">
                      <Trans i18nKey="heartRate">Heart rate</Trans>
                    </label>
                    <div>
                      <input
                        id="heartRate"
                        type="number"
                        name="heartRate"
                        className={styles.vitalInputControl}
                        value={pulse}
                        onChange={evt => setPulse(evt.target.value)}
                      />
                      <span>
                        <Trans i18nKey="bpm">bpm</Trans>
                      </span>
                    </div>
                  </div>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="oxygenSaturation">Oxygen saturation</label>
                    <div>
                      <input
                        id="oxygenSaturation"
                        type="number"
                        name="oxygensaturation"
                        className={styles.vitalInputControl}
                        value={oxygenSaturation}
                        onChange={evt => setOxygenSaturation(evt.target.value)}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className={styles.vitalsContainer}>
                    <div className={styles.vitalInputContainer}>
                      <label htmlFor="temperature">
                        <Trans i18nKey="temperature">Temperature</Trans>
                      </label>
                      <div>
                        <input
                          id="temperature"
                          type="number"
                          name="temperature"
                          className={styles.vitalInputControl}
                          value={temperature}
                          onChange={evt => setTemperature(evt.target.value)}
                        />
                        <span>&deg;C</span>
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
                          id="toggleButton1"
                          type="radio"
                          name="toggleButton"
                          defaultChecked={true}
                        />
                        <label htmlFor="toggleButton1">
                          <Trans i18nKey="celsius">Celsius</Trans>
                        </label>
                        <input
                          id="toggleButton2"
                          type="radio"
                          name="toggleButton"
                        />
                        <label htmlFor="toggleButton2">
                          <Trans i18nKey="fahrenheit">Fahrenheit</Trans>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                  <div className={styles.vitalInputContainer}>
                    <label htmlFor="timeRecorded">
                      <Trans i18nKey="timeRecorded">Time recorded</Trans>
                    </label>
                    <div className="omrs-datepicker">
                      <input
                        id="timeRecorded"
                        type="time"
                        name="timeRecorded"
                        className={styles.vitalInputControl}
                        defaultValue={dayjs.utc(timeRecorded).format("HH:MM")}
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
                      <label htmlFor="weight">
                        <Trans i18nKey="weight">Weight</Trans>
                      </label>
                      <div>
                        <input
                          id="weight"
                          type="number"
                          name="weight"
                          className={styles.vitalInputControl}
                          value={weight}
                          onChange={evt => setWeight(evt.target.value)}
                        />
                        <span>
                          <Trans i18nKey="kg">kg</Trans>
                        </span>
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
                        <label htmlFor="toggleWeight1">
                          <Trans i18nKey="kg">kg</Trans>
                        </label>
                        <input
                          type="radio"
                          name="toggleWeight"
                          id="toggleWeight2"
                        />
                        <label htmlFor="toggleWeight2">
                          <Trans i18nKey="lbs">lbs</Trans>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.vitalsContainer}>
                    <div className={styles.vitalInputContainer}>
                      <label htmlFor="height">
                        <Trans i18nKey="height">Height</Trans>
                      </label>
                      <div>
                        <input
                          id="height"
                          type="number"
                          name="height"
                          className={styles.vitalInputControl}
                          value={height}
                          onChange={evt => setHeight(evt.target.value)}
                        />
                        <span>
                          <Trans i18nKey="cm">cm</Trans>
                        </span>
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
                        <label htmlFor="toggleHeight1">
                          <Trans i18nKey="cm">cm</Trans>
                        </label>

                        <input
                          type="radio"
                          name="toggleHeight"
                          id="toggleHeight2"
                        />
                        <label htmlFor="toggleHeight2">
                          <Trans i18nKey="feet">feet</Trans>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  enableEditButtons
                    ? styles.buttonStyles
                    : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
                }
              >
                <button
                  type="button"
                  className="omrs-btn omrs-outlined-neutral omrs-rounded"
                  style={{ width: "20%" }}
                >
                  <Trans i18nKey="delete">Delete</Trans>
                </button>
                <button
                  type="button"
                  className="omrs-btn omrs-outlined-neutral omrs-rounded"
                  style={{ width: "30%" }}
                  onClick={closeVitalsForm}
                >
                  <Trans i18nKey="cancel">Cancel</Trans>
                </button>
                <button
                  type="submit"
                  className={
                    enableEditButtons
                      ? "omrs-btn omrs-filled-action omrs-rounded"
                      : "omrs-btn omrs-outlined omrs-rounded"
                  }
                  disabled={!enableEditButtons}
                  style={{ width: "50%" }}
                >
                  <Trans i18nKey="signAndSave">Sign & Save</Trans>
                </button>
              </div>
            </form>
          </SummaryCard>
        )}
      </>
    );
  }

  return <div>{viewEditForm ? editVitals() : createVitals()}</div>;
}

VitalsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

export default withConfig(VitalsForm);

type VitalsFormProps = DataCaptureComponentProps & {
  match: match;
  config?: ConfigObject;
};

export type Vitals = {
  height: number;
  weight: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  temperature: number;
  oxygenSaturation: number;
  pulse: number;
};
