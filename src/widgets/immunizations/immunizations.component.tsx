import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";

function Immunizations(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ImmunizationsDetailedSummary />
      </Route>
    </Switch>
  );
}

export default Immunizations;
