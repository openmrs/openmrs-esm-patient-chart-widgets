import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import VitalsDetailedSummary from "./vitals-detailed-summary.component";
import VitalRecord from "./vital-record.component";

function Vitals(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <VitalsDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:vitalUuid`}>
        <VitalRecord />
      </Route>
    </Switch>
  );
}

export default Vitals;
