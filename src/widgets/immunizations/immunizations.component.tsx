import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import { useConfig } from "@openmrs/esm-framework";

function Immunizations() {
  const config = useConfig();
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ImmunizationsDetailedSummary
          immunizationsConfig={config.immunizationsConfig}
        />
      </Route>
    </Switch>
  );
}

export default Immunizations;
