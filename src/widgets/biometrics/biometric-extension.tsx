import React from "react";
import { defineConfigSchema } from "@openmrs/esm-config";
import configSchema from "../../config-schema";
import BiometricOverview from "./biometric-overview.component";
import { openmrsRootDecorator } from "@openmrs/esm-context";

defineConfigSchema("@openmrs/esm-patient-chart-widgets", configSchema);

const RootVitals = () => <BiometricOverview />;

export default openmrsRootDecorator({
  featureName: "biometrics",
  moduleName: "@openmrs/esm-patient-chart-widgets"
})(RootVitals);
