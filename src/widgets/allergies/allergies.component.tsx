import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AllergyDetailedSummary from "./allergies-detailed-summary.component";
import AllergyRecord from "./allergy-record.component";

export default function Allergies(props: AllergiesProps) {
  const match = useRouteMatch();
  const path = match.url.replace(":subView", "details");
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <AllergyDetailedSummary />
      </Route>
      <Route exact path={`${path}/:allergyUuid`}>
        <AllergyRecord />
      </Route>
    </Switch>
  );
}

type AllergiesProps = {};
