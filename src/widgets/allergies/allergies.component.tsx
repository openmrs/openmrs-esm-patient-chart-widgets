import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import AllergyDetailedSummary from "./allergies-detailed-summary.component";
import AllergyRecord from "./allergy-record.component";

export default function Allergies(props: AllergiesProps) {
  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Switch>
        <Route exact path="/patient/:patientUuid/chart/allergies">
          <AllergyDetailedSummary />
        </Route>
        <Route exact path="/patient/:patientUuid/chart/allergies/:allergyUuid">
          <AllergyRecord />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

type AllergiesProps = {};
