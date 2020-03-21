import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AppointmentsDetailedSummary from "./appointments-detailed-summary.component";
import AppointmentRecord from "./appointment-record.component";

export default function Appointements() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <AppointmentsDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:appointmentUuid`}>
        <AppointmentRecord />
      </Route>
    </Switch>
  );
}
