import React from "react";
import { ConfigMock } from "./chart-widgets-config.mock";
import { mockPatient } from "./patient.mock";

export function UserHasAccessReact(props: any) {
  return props.children;
}

export const useCurrentPatient = jest.fn(() => {
  return [false, mockPatient, mockPatient.id, null];
});

export function useConfig() {
  return ConfigMock;
}

export const ComponentContext = React.createContext({
  moduleName: "fake-module-config"
});

export const mockPatientId = mockPatient.id;
