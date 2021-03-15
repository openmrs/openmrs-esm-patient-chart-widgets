import { ConfigMock } from "./chart-widgets-config.mock";
import { mockPatient } from "./patient.mock";
export * from "@openmrs/esm-framework/mock";

export const useCurrentPatient = jest.fn(() => {
  return [false, mockPatient, mockPatient.id, null];
});

export function useConfig() {
  return ConfigMock;
}

export const mockPatientId = mockPatient.id;
