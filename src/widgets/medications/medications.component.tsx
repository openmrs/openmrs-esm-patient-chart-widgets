import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import MedicationsSummary from "./medication-level-two.component";
import MedicationDetailedSummary from "./medication-level-three/medication-level-three.component";

function Medications(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <MedicationsSummary />
      </Route>
      <Route exact path={`${match.path}/:medicationUuid`}>
        <MedicationDetailedSummary />
      </Route>
    </Switch>
  );
}

export default Medications;
