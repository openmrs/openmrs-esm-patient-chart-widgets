import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ProgramsDetailedSummary from "./programs-detailed-summary.component";
import ProgramRecord from "./program-record.component";

function Programs(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ProgramsDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:programUuid`}>
        <ProgramRecord />
      </Route>
    </Switch>
  );
}

export default Programs;
