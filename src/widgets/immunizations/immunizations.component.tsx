import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import { defineConfigSchema } from "@openmrs/esm-module-config";
import { immunizationPatientWidgetSchema } from "./immunization-widget-config-schema";

function Immunizations(props) {
  const match = useRouteMatch();
  defineConfigSchema(
    "@openmrs/esm-patient-chart-widgets",
    immunizationPatientWidgetSchema
  );

  return (
    <Switch>
      <Route exact path={match.path}>
        <ImmunizationsDetailedSummary />
      </Route>
    </Switch>
  );
}

export default Immunizations;
