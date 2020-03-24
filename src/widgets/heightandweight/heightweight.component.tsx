import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import HeightAndWeightSummary from "./heightandweight-summary.component";
import HeightAndWeightDetailedSummary from "./heightandweight-detailed-summary.component";

function HeightWeight(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <HeightAndWeightSummary />
      </Route>
      <Route exact path={`${match.path}/:heightWeightUuid`}>
        <HeightAndWeightDetailedSummary />
      </Route>
    </Switch>
  );
}

export default HeightWeight;
