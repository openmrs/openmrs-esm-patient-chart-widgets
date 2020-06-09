import React from "react";
import { chartWidgetsConfigMock } from "./chart-widgets-config.mock";

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn()
};

export function useConfig() {
  return chartWidgetsConfigMock;
}

export const ModuleNameContext = React.createContext("fake-module-config");
