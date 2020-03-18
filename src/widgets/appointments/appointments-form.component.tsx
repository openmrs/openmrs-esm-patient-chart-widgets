import styles from "./appointments-form.css";
import React, { useState } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import { getSession } from "../vitals/vitals-card.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import {
  createAppointment,
  getAppointmentService,
  getAppointmentServiceAll
} from "./appointments.resource";
import { useHistory } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";

export default function AppointmentsForm() {
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  let history = useHistory();
  let providers = null;
  let status = null;
  const [currentSession, setCurrentSession] = useState(null);
  const [appointmentService, setAppointmentService] = useState(null);
  const [appointmentServiceType, setAppointmentServiceType] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentStartTime, setAppointmentStartTime] = useState(null);
  const [appointmentEndTime, setAppointmentEndTime] = useState(null);
  const [appointmentKind, setAppointmentKind] = useState("Scheduled");
  const [comments, setComment] = useState(null);
  const [location, setLocation] = useState(null);
  const [serviceUuid, setServiceUuid] = useState("");
  const [serviceTypeUuid, setServiceTypeUuid] = useState("");

  React.useEffect(() => {
    const abortController = new AbortController();
    if (patientUuid) {
      getAppointmentServiceAll(abortController).then(response => {
        setAppointmentService(response.data);
      }, createErrorHandler());
      getSession(abortController).then(response => {
        setCurrentSession(response.data);
        setLocation(response.data.sessionLocation);
      }, createErrorHandler());
    }

    return () => abortController.signal;
  }, [patientUuid]);

  React.useEffect(() => {
    const abortController = new AbortController();
    if (serviceUuid && serviceUuid != "default") {
      getAppointmentService(abortController, serviceUuid).then(response => {
        setAppointmentServiceType(response.data.serviceTypes);
        //setAppointmentStartTime()
      });
    }
  }, [serviceUuid]);
  function navigate() {
    history.push(`/patient/${patientUuid}/chart/appointments`);
  }

  const handleCreateFormSubmit = event => {
    event.preventDefault();
    let startDateTime = new Date(appointmentDate + " " + appointmentStartTime);
    let endDateTime = new Date(appointmentDate + " " + appointmentEndTime);

    let appointment: Appointment = {
      serviceTypeUuid: serviceTypeUuid,
      serviceUuid: serviceUuid,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      appointmentKind: appointmentKind,
      comments: comments,
      locationUuid: location,
      patientUuid: patientUuid,
      status: status,
      providerUuid: currentSession.currentProvider.uuid
    };
    const abortController = new AbortController();
    createAppointment(appointment, abortController).then(response => {
      response.status == 200 && navigate();
    }, createErrorHandler());
  };

  return (
    <SummaryCard
      name="Appointment Form"
      styles={{ backgroundColor: "var(--omrs-color-bg-medium-contrast)" }}
    >
      <form
        onSubmit={handleCreateFormSubmit}
        className={styles.appointmentContainer}
      >
        <div className={styles.inputContainer}>
          <label htmlFor="service">Service</label>
          <select
            name="service"
            id="service"
            defaultChecked={true}
            onChange={$event => setServiceUuid($event.target.value)}
            value={serviceUuid}
          >
            <option key={0} value={"default"}>
              Select Service
            </option>
            {appointmentService &&
              appointmentService.map(service => {
                return (
                  <option key={service.uuid} value={service.uuid}>
                    {service.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="serviceType">Service Type</label>
          <select
            name="serviceType"
            id="serviceType"
            onChange={$event => setServiceTypeUuid($event.target.value)}
            defaultValue={serviceUuid}
          >
            {appointmentServiceType &&
              appointmentServiceType.map(serviceType => {
                return (
                  <option key={serviceType.uuid} value={serviceType.uuid}>
                    {serviceType.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className={styles.inputContainer} style={{ flexDirection: "row" }}>
          <div className={styles.inputContainer}>
            <label htmlFor="date">Date</label>
            <div className="omrs-datepicker">
              <input
                type="date"
                name="datepicker"
                onChange={$event => setAppointmentDate($event.target.value)}
                required
              />
              <svg className="omrs-icon" role="img">
                <use xlinkHref="#omrs-icon-calendar"></use>
              </svg>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="startTime">Start Time</label>
            <div className="omrs-datepicker">
              <input
                type="time"
                name="datepicker"
                onChange={$event =>
                  setAppointmentStartTime($event.target.value)
                }
                required
              />
              <svg className="omrs-icon" role="img">
                <use xlinkHref="#omrs-icon-access-time"></use>
              </svg>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="endTime">End Time</label>
            <div className="omrs-datepicker">
              <input
                type="time"
                name="datepicker"
                onChange={$event => setAppointmentEndTime($event.target.value)}
                required
              />
              <svg className="omrs-icon" role="img">
                <use xlinkHref="#omrs-icon-access-time"></use>
              </svg>
            </div>
          </div>
        </div>
        ​
        <div className={styles.inputContainer}>
          <div className="omrs-checkbox">
            <label>
              <input
                type="checkbox"
                name="omrs-checkbox"
                onChange={$event => setAppointmentKind($event.target.value)}
                value="WalkIn"
              />
              <span> Walk in Appointment</span>
            </label>
          </div>
        </div>
        ​
        <div className={styles.inputContainer}>
          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            id="notes"
            rows={5}
            onChange={$event => setComment($event.target.value)}
          />
        </div>
        <div className={styles.saveButtonContainer}>
          <button
            className={`omrs-btn omrs-outlined-neutral`}
            onClick={$event => handleCreateFormSubmit($event)}
          >
            Cancel
          </button>
          <button
            className={`omrs-btn omrs-filled-action`}
            onClick={$event => handleCreateFormSubmit($event)}
          >
            Save
          </button>
        </div>
      </form>
    </SummaryCard>
  );
}

export type Appointment = {
  serviceUuid: string;
  serviceTypeUuid: string;
  startDateTime: Date;
  endDateTime: Date;
  appointmentKind: string;
  comments: string;
  locationUuid?: string;
  providerUuid?: string;
  status?: string;
  patientUuid: string;
};
