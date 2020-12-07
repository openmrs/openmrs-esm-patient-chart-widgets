import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import ConditionRecord from "./condition-record.component";

function Conditions() {
  const path = "/patient/:patientUuid/chart/conditions";

  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Switch>
        <Route exact path={path}>
          <ConditionsDetailedSummary />
        </Route>
        <Route exact path={`${path}/:conditionUuid`}>
          <ConditionRecord />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Conditions;
