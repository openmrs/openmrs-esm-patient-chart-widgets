import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import ConditionRecord from "./condition-record.component";

function Conditions(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ConditionsDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:programUuid`}>
        <ConditionRecord />
      </Route>
    </Switch>
  );
}

export default Conditions;
