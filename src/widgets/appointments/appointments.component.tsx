import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import AppointmentsDetailedSummary from "./appointments-detailed-summary.component";
import AppointmentRecord from "./appointment-record.component";

export default function Appointments() {
  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Switch>
        <Route exact path="/patient/:patientUuid/chart/appointments">
          <AppointmentsDetailedSummary />
        </Route>
        <Route
          exact
          path="/patient/:patientUuid/chart/appointments/:appointmentUuid"
        >
          <AppointmentRecord />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
