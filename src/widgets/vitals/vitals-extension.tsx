import React from "react";
import { defineConfigSchema } from "@openmrs/esm-config";
import configSchema from "../../config-schema";
import VitalsOverview from "./vitals-overview.component";
import { openmrsRootDecorator } from "@openmrs/esm-context";

defineConfigSchema("@openmrs/esm-patient-chart-widgets", configSchema);

const RootVitals = () => <VitalsOverview />;

export default openmrsRootDecorator({
  featureName: "vitalsWidget",
  moduleName: "@openmrs/esm-patient-chart-widgets"
})(RootVitals);
