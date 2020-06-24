import React from "react";
import { ConfigMock } from "./chart-widgets-config.mock";

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn()
};

export function useConfig() {
  return ConfigMock;
}

export const ModuleNameContext = React.createContext("fake-module-config");
