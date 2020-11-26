import React from "react";
import { ModuleNameContext, useConfig } from "@openmrs/esm-react-utils";
import { ConfigObject } from "./config-schema";
import { merge } from "lodash-es";

/**
 * A HOC that injects configuration into widgets
 */
export default function withConfig(Comp) {
  return provideContext(injectConfig(Comp));
}

function provideContext(Comp) {
  return function WithContext(props) {
    return (
      <ModuleNameContext.Provider value="@openmrs/esm-patient-chart-widgets">
        <Comp {...props} />
      </ModuleNameContext.Provider>
    );
  };
}

function injectConfig(Comp) {
  return function WithConfigProps(props) {
    const moduleConfig = useConfig() as ConfigObject;
    const config = merge(moduleConfig, props?.props?.config || {});
    return <Comp config={config} {...props} />;
  };
}
