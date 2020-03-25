import React, { useEffect, useRef, useState } from "react";
import styles from "./programs-form.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  fetchPrograms,
  fetchEnrolledPrograms,
  fetchLocations,
  saveProgramEnrollment
} from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import dayjs from "dayjs";
import { filter, includes, map } from "lodash-es";

export default function ProgramsForm(props: ProgramsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [enableButtons, setEnableButtons] = useState(false);
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
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

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
    if (allPrograms && enrolledPrograms) {
      setEligiblePrograms(
        filter(allPrograms, program => {
          return !includes(map(enrolledPrograms, "program.uuid"), program.uuid);
        })
      );
    }
  }, [allPrograms, enrolledPrograms]);

  useEffect(() => {
    if (program) {
      setEnableButtons(false);
    } else {
      setEnableButtons(true);
    }
  }, [program]);

  const handleSubmit = $event => {
    $event.preventDefault();
    const enrollmentPayload: ProgramEnrollment = {
      program: program,
      patient: patientUuid,
      dateEnrolled: enrollmentDate,
      dateCompleted: completionDate,
      location: location
    };
    const abortController = new AbortController();
    saveProgramEnrollment(enrollmentPayload, abortController).subscribe(
      response => response.status === 201 && props.entrySubmitted()
    );
    setProgram("");
    setLocation("");
    return () => abortController.abort();
  };

  const resetForm = () => {
    formRef.current.reset();
    props.entryCancelled();
    setProgram("");
    setLocation("");
  };

  return (
    <form
      onChange={() => props.entryStarted()}
      onSubmit={handleSubmit}
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
                onChange={evt => setLocation(evt.target.value)}
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
          enableButtons
            ? styles.buttonStyles
            : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
        }
      >
        <button
          type="button"
          className="omrs-btn omrs-outlined-neutral omrs-rounded"
          style={{ width: "50%" }}
          onClick={resetForm}
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
          Enroll
        </button>
      </div>
    </form>
  );
}

ProgramsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {}
};

type ProgramsFormProps = DataCaptureComponentProps & {};

type ProgramEnrollment = {
  program: string;
  patient?: string;
  dateEnrolled?: string;
  dateCompleted?: string;
  location?: string;
};

type DataCaptureComponentProps = {
  entryStarted: () => {};
  entrySubmitted: () => {};
  entryCancelled: () => {};
};
