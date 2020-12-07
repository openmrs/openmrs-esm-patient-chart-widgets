import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import ProgramsDetailedSummary from "./programs-detailed-summary.component";
import ProgramRecord from "./program-record.component";

function Programs() {
  const path = "/patient/:patientUuid/chart/programs";

  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Switch>
        <Route exact path={`${path}`}>
          <ProgramsDetailedSummary />
        </Route>
        <Route exact path={`${path}/:programUuid`}>
          <ProgramRecord />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Programs;
