import React, { useEffect, useState, useRef } from "react";
import { useRouteMatch } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./conditions-form.css";
import { DataCaptureComponentProps } from "../shared-utils";

export function ConditionsForm(props: ConditionsFormProps) {
  const [conditionName, setConditionName] = useState("");
  const [conditionUuid, setConditionUuid] = useState("");
  const [clinicalStatus, setClinicalStatus] = useState(null);
  const [onsetDateTime, setOnsetDateTime] = useState(null);
  const [enableCreateButtons, setEnableCreateButtons] = useState(false);
  const [enableEditButtons, setEnableEditButtons] = useState(true);
  const [viewEditForm, setViewEditForm] = useState(true);
  const [inactiveStatus, setInactiveStatus] = useState(false);
  const [inactivityDate, setInactivityDate] = useState("");
  const [formChanged, setFormChanged] = useState<Boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const match = useRouteMatch();

  useEffect(() => {
    if (conditionName && onsetDateTime && clinicalStatus) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [conditionName, onsetDateTime, clinicalStatus]);

  useEffect(() => {
    if (viewEditForm && formChanged) {
      setEnableEditButtons(false);
    } else {
      setEnableEditButtons(true);
    }
  }, [viewEditForm, formChanged]);

  useEffect(() => {
    if (props.match.params) {
      const {
        conditionUuid,
        conditionName,
        clinicalStatus,
        onsetDateTime
      }: Condition = props.match.params;
      if (conditionName && clinicalStatus && onsetDateTime) {
        setViewEditForm(true);
        setConditionUuid(conditionUuid), setConditionName(conditionName);
        setClinicalStatus(clinicalStatus);
        setOnsetDateTime(onsetDateTime);
      } else {
        setViewEditForm(false);
      }
    }
  }, [props.match.params]);

  const handleCreateFormSubmit = event => {
    event.preventDefault();
  };

  function createForm() {
    return (
      <form
        onSubmit={handleCreateFormSubmit}
        onChange={() => {
          setFormChanged(true);
          return props.entryStarted();
        }}
        ref={formRef}
      >
        <SummaryCard
          name="Add a new condition"
          styles={{
            width: "100%",
            background: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          <div className={styles.conditionsContainerWrapper}>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              <div
                className={`omrs-type-body-regular ${styles.conditionsInputContainer}`}
              >
                <label htmlFor="conditionName">Condition</label>
                <div className="omrs-input-group">
                  <input
                    id="conditionName"
                    className="omrs-input-outlined"
                    type="text"
                    onChange={evt => setConditionName(evt.target.value)}
                    required
                    style={{ height: "2.75rem" }}
                  />
                </div>
              </div>
              <div className={styles.conditionsInputContainer}>
                <label htmlFor="onsetDate">Date of onset</label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="onsetDate"
                    required
                    onChange={evt => setOnsetDateTime(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.conditionsInputContainer}>
                <label htmlFor="currentStatus">Current status</label>
                <div className={styles.statusContainer}>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="active"
                        onChange={evt => {
                          setClinicalStatus(evt);
                          setInactiveStatus(false);
                        }}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="inactive"
                        onChange={evt => {
                          setClinicalStatus(evt);
                          setInactiveStatus(true);
                        }}
                      />
                      <span>Inactive</span>
                    </label>
                  </div>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="historyOf"
                        onChange={evt => {
                          setClinicalStatus(evt);
                          setInactiveStatus(true);
                        }}
                      />
                      <span>History of</span>
                    </label>
                  </div>
                </div>
              </div>
              {inactiveStatus && (
                <div className={styles.conditionsInputContainer}>
                  <label htmlFor="dateOfInactivity">Date of inactivity</label>
                  <div className="omrs-datepicker">
                    <input
                      type="date"
                      id="dateOfInactivity"
                      name="dateOfInactivity"
                      defaultValue={inactivityDate}
                      onChange={event => setInactivityDate(event.target.value)}
                    />
                    <svg className="omrs-icon" role="img">
                      <use xlinkHref="#omrs-icon-calendar"></use>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SummaryCard>
        <div
          className={
            enableCreateButtons
              ? `${styles.buttonStyles} ${styles.buttonStylesBorder}`
              : styles.buttonStyles
          }
        >
          <button
            type="button"
            className="omrs-btn omrs-outlined-neutral omrs-rounded"
            style={{ width: "50%" }}
            onClick={closeForm}
          >
            Cancel
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
            Sign & Save
          </button>
        </div>
      </form>
    );
  }

  const closeForm = event => {
    let userConfirmed: boolean = false;
    if (formChanged) {
      userConfirmed = confirm(
        "There is ongoing work, are you sure you want to close this tab?"
      );
    }

    if (userConfirmed && formChanged) {
      props.entryCancelled();
      props.closeComponent();
    } else if (!formChanged) {
      props.entryCancelled();
      props.closeComponent();
    }
  };

  const handleEditSubmit = event => {
    event.preventDefault();
  };

  function editForm() {
    return (
      <>
        {conditionName && clinicalStatus && onsetDateTime && (
          <form
            onChange={() => {
              setFormChanged(true);
              return props.entryStarted();
            }}
            onSubmit={handleEditSubmit}
            className={styles.conditionsForm}
            ref={formRef}
          >
            <SummaryCard
              name="Edit condition"
              styles={{
                width: "100%",
                backgroundColor: "var(--omrs-color-bg-medium-contrast)",
                height: "auto"
              }}
            >
              <div className={styles.conditionsContainerWrapper}>
                <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                  <div
                    className={`omrs-type-body-regular ${styles.conditionsInputContainer}`}
                  >
                    <label htmlFor="conditionName">Condition</label>
                    <span className="omrs-medium">{conditionName}</span>
                  </div>
                  <div className={styles.conditionsInputContainer}>
                    <label htmlFor="onsetDate">Date of onset</label>
                    <div className="omrs-datepicker">
                      <input
                        type="date"
                        id="onsetDate"
                        name="onsetDate"
                        defaultValue={onsetDateTime}
                      />
                      <svg className="omrs-icon" role="img">
                        <use xlinkHref="#omrs-icon-calendar"></use>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.conditionsInputContainer}>
                    <label htmlFor="currentStatus">Current status</label>
                    <div className={styles.statusContainer}>
                      <div className="omrs-radio-button">
                        <label>
                          <input
                            id="active"
                            type="radio"
                            name="currentStatus"
                            value="active"
                            defaultChecked={clinicalStatus === "active"}
                            onChange={evt => {
                              setClinicalStatus(evt.target.value);
                              setInactiveStatus(false);
                            }}
                          />
                          <span>Active</span>
                        </label>
                      </div>
                      <div className="omrs-radio-button">
                        <label>
                          <input
                            id="inactive"
                            type="radio"
                            name="currentStatus"
                            value="inactive"
                            defaultChecked={clinicalStatus === "inactive"}
                            onChange={evt => {
                              setClinicalStatus(evt.target.value);
                              setInactiveStatus(true);
                            }}
                          />
                          <span>Inactive</span>
                        </label>
                      </div>
                      <div className="omrs-radio-button">
                        <label>
                          <input
                            id="historyOf"
                            type="radio"
                            name="currentStatus"
                            value="historyOf"
                            defaultChecked={clinicalStatus === "historyOf"}
                            onChange={evt => {
                              setClinicalStatus(evt.target.value);
                              setInactiveStatus(true);
                            }}
                          />
                          <span>History of</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {inactiveStatus && (
                    <div className={styles.conditionsInputContainer}>
                      <label htmlFor="dateOfInactivity">
                        Date of inactivity
                      </label>
                      <div className="omrs-datepicker">
                        <input
                          type="date"
                          id="dateOfInactivity"
                          name="dateOfInactivity"
                          defaultValue={inactivityDate}
                          onChange={event =>
                            setInactivityDate(event.target.value)
                          }
                        />
                        <svg className="omrs-icon" role="img">
                          <use xlinkHref="#omrs-icon-calendar"></use>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SummaryCard>
            <div
              className={
                enableEditButtons
                  ? styles.buttonStyles
                  : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
              }
            >
              <button
                type="submit"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                style={{ width: "20%" }}
              >
                Delete
              </button>
              <button
                type="button"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                onClick={closeForm}
                style={{ width: "30%" }}
              >
                Cancel changes
              </button>
              <button
                type="submit"
                className={
                  enableEditButtons
                    ? "omrs-btn omrs-outlined omrs-rounded"
                    : "omrs-btn omrs-filled-action omrs-rounded"
                }
                disabled={enableEditButtons}
                style={{ width: "50%" }}
              >
                Sign & Save
              </button>
            </div>
          </form>
        )}
      </>
    );
  }

  return <div>{viewEditForm ? editForm() : createForm()}</div>;
}

ConditionsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

type ConditionsFormProps = DataCaptureComponentProps & {
  match: any;
};

type Condition = {
  conditionUuid: string;
  conditionName: string;
  clinicalStatus: string;
  onsetDateTime: string;
};
