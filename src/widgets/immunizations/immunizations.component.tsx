import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";

interface ImmunizationsProps {
  basePath: string;
}

export default function Immunizations({ basePath }: ImmunizationsProps) {
  const root = `${basePath}/immunizations`;
  return (
    <BrowserRouter basename={root}>
      <Switch>
        <Route exact path="/" component={ImmunizationsDetailedSummary} />
      </Switch>
    </BrowserRouter>
  );
}
