import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import ImmunizationRecord from "./immunization-record.component";

function Immunizations(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ImmunizationsDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:immunizationUuid`}>
        <ImmunizationRecord />
      </Route>
    </Switch>
  );
}

export default Immunizations;
