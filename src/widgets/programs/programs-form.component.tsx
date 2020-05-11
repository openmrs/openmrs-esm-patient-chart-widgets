import React, { useEffect, useRef, useState } from "react";
import styles from "./programs-form.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  createProgramEnrollment,
  fetchPrograms,
  fetchEnrolledPrograms,
  fetchLocations,
  getPatientProgramByUuid,
  getSession,
  updateProgramEnrollment
} from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import dayjs from "dayjs";
import { filter, includes, map } from "lodash-es";
import { useHistory } from "react-router-dom";
import { DataCaptureComponentProps } from "../shared-utils";

export default function ProgramsForm(props: ProgramsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [viewEditForm, setViewEditForm] = useState(false);
  const [enableCreateButtons, setEnableCreateButtons] = useState(false);
  const [enableEditButtons, setEnableEditButtons] = useState(false);
  const [patientProgram, setPatientProgram] = useState(null);
  const [allPrograms, setAllPrograms] = useState(null);
  const [eligiblePrograms, setEligiblePrograms] = useState(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState(null);
  const [location, setLocation] = useState("");
  const [program, setProgram] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [completionDate, setCompletionDate] = useState(null);
  const [locations, setLocations] = useState(null);
  const [formChanged, setFormChanged] = useState<Boolean>(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const history = useHistory();

  useEffect(() => {
    if (patientUuid && !viewEditForm) {
      const abortController = new AbortController();
      getSession(abortController).then(({ data }) => {
        const { sessionLocation } = data;
        if (sessionLocation && sessionLocation.uuid) {
          setLocation(sessionLocation.uuid);
        }
      });
    }
  }, [patientUuid]);

  useEffect(() => {
    if (patientUuid) {
      const sub1 = fetchLocations().subscribe(locations => {
        return setLocations(locations);
      }, createErrorHandler());
      const sub2 = fetchPrograms().subscribe(
        programs => setAllPrograms(programs),
        createErrorHandler()
      );
      const sub3 = fetchEnrolledPrograms(patientUuid).subscribe(
        enrolledPrograms => setEnrolledPrograms(enrolledPrograms),
        createErrorHandler()
      );

      return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
        sub3.unsubscribe();
      };
    }
  }, [patientUuid]);

  useEffect(() => {
    if (viewEditForm && patientUuid && props.match.params) {
      const subscription = getPatientProgramByUuid(
        props.match.params["programUuid"]
      ).subscribe(program => setPatientProgram(program), createErrorHandler());

      return () => subscription.unsubscribe();
    }
  }, [viewEditForm, patientUuid, props.match.params]);

  useEffect(() => {
    const {
      program,
      programUuid,
      enrollmentDate,
      completionDate,
      location
    } = props.match.params;

    if (program && enrollmentDate) {
      setViewEditForm(true);
      setLocation(location);
      setProgram(programUuid);
      setCompletionDate(completionDate);
      setEnrollmentDate(enrollmentDate);
    }
  }, [props.match.params]);

  useEffect(() => {
    if (allPrograms && enrolledPrograms) {
      setEligiblePrograms(
        filter(allPrograms, program => {
          return !includes(map(enrolledPrograms, "program.uuid"), program.uuid);
        })
      );
    }
  }, [allPrograms, enrolledPrograms]);

  useEffect(() => {
    if (enrollmentDate && program) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [enrollmentDate, program]);

  useEffect(() => {
    if (viewEditForm && formChanged) {
      setEnableEditButtons(false);
    } else {
      setEnableEditButtons(true);
    }
  }, [viewEditForm, formChanged]);

  const handleCreateSubmit = $event => {
    $event.preventDefault();
    const enrollmentPayload: ProgramEnrollment = {
      program: program,
      patient: patientUuid,
      dateEnrolled: enrollmentDate,
      dateCompleted: completionDate,
      location: location
    };
    const abortController = new AbortController();
    createProgramEnrollment(enrollmentPayload, abortController).subscribe(
      response => response.status === 201 && navigate()
    );
    return () => abortController.abort();
  };

  const handleEditSubmit = $event => {
    $event.preventDefault();
    if (completionDate || enrollmentDate || location) {
      const updatePayload: ProgramEnrollment = {
        program: program,
        dateCompleted: completionDate,
        dateEnrolled: enrollmentDate,
        location: location
      };
      const abortController = new AbortController();
      updateProgramEnrollment(updatePayload, abortController).subscribe(
        response => response.status === 200 && navigate()
      );
      return () => abortController.abort();
    }
  };

  const navigate = () => {
    history.push(`/patient/${patientUuid}/chart/programs/care-programs`);
    props.closeComponent();
  };

  const closeForm = $event => {
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

  function createProgramForm() {
    return (
      <form
        onChange={() => {
          setFormChanged(true);
          return props.entryStarted();
        }}
        onSubmit={handleCreateSubmit}
        className={styles.programsForm}
        ref={formRef}
      >
        <SummaryCard
          name="Add a new program"
          styles={{
            width: "100%",
            backgroundColor: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          <div className={styles.programsContainerWrapper}>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              <div className={styles.programsInputContainer}>
                <label htmlFor="program">Program</label>
                <select
                  id="program"
                  name="programs"
                  value={program}
                  onChange={evt => setProgram(evt.target.value)}
                  required
                >
                  <option>Choose a program:</option>
                  {eligiblePrograms &&
                    eligiblePrograms.map(program => (
                      <option value={program.uuid} key={program.uuid}>
                        {program.display}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.programsInputContainer}>
                <label htmlFor="enrollmentDate">Date enrolled</label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="enrollmentDate"
                    required
                    onChange={evt => setEnrollmentDate(evt.target.value)}
                    defaultValue={dayjs(new Date()).format("YYYY-MM-DD")}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.programsInputContainer}>
                <label htmlFor="completionDate">Date completed</label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="completionDate"
                    onChange={evt => setCompletionDate(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.programsInputContainer}>
                <label htmlFor="location">Enrollment location</label>
                <select
                  id="location"
                  name="locations"
                  value={location}
                  onChange={evt => {
                    setLocation(evt.target.value);
                  }}
                >
                  <option>Choose a location:</option>
                  {locations &&
                    locations.map(location => (
                      <option value={location.uuid} key={location.uuid}>
                        {location.display}
                      </option>
                    ))}
                </select>
              </div>
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
            Enroll
          </button>
        </div>
      </form>
    );
  }

  function editProgramForm() {
    return (
      <>
        {patientProgram && (
          <form
            onChange={() => {
              setFormChanged(true);
              return props.entryStarted();
            }}
            onSubmit={handleEditSubmit}
            className={styles.programsForm}
            ref={formRef}
          >
            <SummaryCard
              name="Edit Program"
              styles={{
                width: "100%",
                backgroundColor: "var(--omrs-color-bg-medium-contrast)",
                height: "auto"
              }}
            >
              <div className={styles.programsContainerWrapper}>
                <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                  <div className={styles.programsInputContainer}>
                    <label htmlFor="program">Program</label>
                    <span className="omrs-medium">
                      {patientProgram.display}
                    </span>
                  </div>
                  <div className={styles.programsInputContainer}>
                    <label htmlFor="enrollmentDate">Date enrolled</label>
                    <div className="omrs-datepicker">
                      <input
                        type="date"
                        name="enrollmentDate"
                        required
                        onChange={evt => setEnrollmentDate(evt.target.value)}
                        defaultValue={dayjs(enrollmentDate).format(
                          "YYYY-MM-DD"
                        )}
                      />
                      <svg className="omrs-icon" role="img">
                        <use xlinkHref="#omrs-icon-calendar"></use>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.programsInputContainer}>
                    <label htmlFor="completionDate">Date completed</label>
                    <div className="omrs-datepicker">
                      <input
                        type="date"
                        name="completionDate"
                        onChange={evt => setCompletionDate(evt.target.value)}
                        defaultValue={
                          completionDate
                            ? dayjs(completionDate).format("YYYY-MM-DD")
                            : ""
                        }
                      />
                      <svg className="omrs-icon" role="img">
                        <use xlinkHref="#omrs-icon-calendar"></use>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.programsInputContainer}>
                    <label htmlFor="location">Enrollment location</label>
                    <select
                      id="location"
                      name="locations"
                      value={location}
                      onChange={evt => setLocation(evt.target.value)}
                    >
                      {locations &&
                        locations.map(location => (
                          <option value={location.uuid} key={location.uuid}>
                            {location.display}
                          </option>
                        ))}
                    </select>
                  </div>
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
                style={{ width: "50%" }}
                className={
                  enableEditButtons
                    ? "omrs-btn omrs-outlined omrs-rounded"
                    : "omrs-btn omrs-filled-action omrs-rounded"
                }
                disabled={enableEditButtons}
              >
                Save
              </button>
              <button
                type="button"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                style={{ width: "50%" }}
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </>
    );
  }

  return <div>{viewEditForm ? editProgramForm() : createProgramForm()}</div>;
}

ProgramsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

type ProgramsFormProps = DataCaptureComponentProps & { match: any };

type ProgramEnrollment = {
  program: string;
  patient?: string;
  dateEnrolled?: string;
  dateCompleted?: string;
  location?: string;
};
