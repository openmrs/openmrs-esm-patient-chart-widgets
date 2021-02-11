import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import { ConfigObject } from "../../config-schema";

interface ImmunizationsProps {
  config: ConfigObject;
}

function Immunizations(props: ImmunizationsProps) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ImmunizationsDetailedSummary
          immunizationsConfig={props.config.immunizationsConfig}
        />
      </Route>
    </Switch>
  );
}

export default Immunizations;
