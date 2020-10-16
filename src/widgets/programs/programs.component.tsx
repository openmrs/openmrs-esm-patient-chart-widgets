import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ProgramsDetailedSummary from "./programs-detailed-summary.component";
import ProgramRecord from "./program-record.component";

function Programs(props) {
  const match = useRouteMatch();
  const path = match.url.replace(":subView", "details");
  return (
    <Switch>
      <Route exact path={path}>
        <ProgramsDetailedSummary />
      </Route>
      <Route exact path={`${path}/:programUuid`}>
        <ProgramRecord />
      </Route>
    </Switch>
  );
}

export default Programs;
