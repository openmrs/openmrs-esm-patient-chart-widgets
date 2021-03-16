import "@testing-library/jest-dom/extend-expect";
import { useCurrentPatient, useConfig } from "@openmrs/esm-framework/mock";
import { mockPatient } from "../__mocks__/patient.mock";
import { ConfigMock } from "../__mocks__/chart-widgets-config.mock";

useCurrentPatient.mockReturnValue([false, mockPatient, mockPatient.id, null]);
useConfig.mockReturnValue(ConfigMock);
