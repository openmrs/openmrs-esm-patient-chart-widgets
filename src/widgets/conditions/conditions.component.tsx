import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import ConditionRecord from "./condition-record.component";

function Conditions(props) {
  const match = useRouteMatch();
  const path = match.url.replace(":subView", "details");

  return (
    <Switch>
      <Route exact path={match.path}>
        <ConditionsDetailedSummary />
      </Route>
      <Route exact path={`${path}/:conditionUuid`}>
        <ConditionRecord />
      </Route>
    </Switch>
  );
}

export default Conditions;
