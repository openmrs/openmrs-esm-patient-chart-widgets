import React from "react";
import { Switch, Route } from "react-router-dom";
import MedicationsSummary from "./medication-level-two.component";
import MedicationDetailedSummary from "./medication-level-three/medication-level-three.component";
import MedicationsOverview from "./medications-overview.component";

function Medications(props) {
  return (
    <Switch>
      <Route exact path="*/medication-orders">
        <MedicationsSummary />
      </Route>
      <Route exact path="*/medication-orders/:medicationUuid">
        <MedicationDetailedSummary />
      </Route>
      <Route>
        <MedicationsOverview />
      </Route>
    </Switch>
  );
}

export default Medications;
