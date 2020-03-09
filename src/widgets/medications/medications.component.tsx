import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import MedicationsSummary from "./medication-level-two.component";
import MedicationDetailedSummary from "./medication-level-three/medication-level-three.component";

function Medications(props) {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path="*/medication-orders">
        <MedicationsSummary />
      </Route>
      <Route path="*/medication-orders/:medicationUuid">
        <MedicationDetailedSummary />
      </Route>
    </Switch>
  );
}

export default Medications;
