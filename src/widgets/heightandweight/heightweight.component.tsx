import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import HeightAndWeightSummary from "./heightandweight-summary.component";
import HeightAndWeightRecord from "./heightandweight-record.component";

function HeightWeight(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <HeightAndWeightSummary />
      </Route>
      <Route exact path={`${match.path}/:heightWeightUuid`}>
        <HeightAndWeightRecord />
      </Route>
    </Switch>
  );
}

export default HeightWeight;
