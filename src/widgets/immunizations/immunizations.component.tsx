import React from "react";
import {
  Route,
  useRouteMatch,
  BrowserRouter,
  Switch,
  useLocation
} from "react-router-dom";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import withConfig from "../../with-config";
import { ConfigObject } from "../../config-schema";

function Immunizations(props: ImmunizationsProps) {
  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Switch>
        <Route exact path="/patient/:patientUuid/chart/immunizations">
          <ImmunizationsDetailedSummary
            immunizationsConfig={props.config.immunizationsConfig}
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

type ImmunizationsProps = {
  config: ConfigObject;
};
export default withConfig(Immunizations);
