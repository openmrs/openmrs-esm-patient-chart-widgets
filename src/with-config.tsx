import React from "react";
import { ModuleNameContext, useConfig } from "@openmrs/esm-module-config";
import { ConfigObject } from "./config-schema";
import { merge } from "lodash-es";

/**
 * A HOC that injects configuration into widgets
 */
export default function withConfig(Comp) {
  return function ConfigContextProvider(props) {
    const ConfigProvider = () => {
      const moduleConfig = useConfig() as ConfigObject;
      const config = merge(moduleConfig, props["config"] || {});
      return <Comp config={config} {...props} />;
    };
    return (
      <ModuleNameContext.Provider value="@openmrs/esm-patient-chart-widgets">
        <ConfigProvider />
      </ModuleNameContext.Provider>
    );
  };
}
