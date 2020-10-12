import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import { defineConfigSchema } from "@openmrs/esm-config";
import withConfig from "../../with-config";
import { ConfigObject } from "../../config-schema";

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

type ImmunizationsProps = {
  config: ConfigObject;
};
export default withConfig(Immunizations);
