import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import ImmunizationsOverview from "./immunizations-overview.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  patient,
  mockPatientImmunizationsResult
} from "../../../__mocks__/immunizations.mock";

const mockUseCurrentPatient = useCurrentPatient as jest.MockedFunction<any>;
const mockPerformPatientImmunizationsSearch = performPatientImmunizationsSearch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./immunizations.resource", () => ({
  performPatientImmunizationsSearch: jest.fn()
}));

const match = { params: {}, isExact: false, path: "/", url: "/" };
let wrapper;

describe("<ImmunizationsOverview />", () => {
  afterEach(() => {
    cleanup;
  });

  beforeEach(mockUseCurrentPatient.mockReset);

  it("should render without dying", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);

    mockPerformPatientImmunizationsSearch.mockResolvedValue(
      mockPatientImmunizationsResult
    );

    wrapper = render(
      <BrowserRouter>
        <ImmunizationsOverview basePath="/" />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it("should display the patient immunizations correctly", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsResult)
    );

    wrapper = render(
      <BrowserRouter>
        <ImmunizationsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByText("Hypertension")).toBeTruthy();
      expect(wrapper.getByText("Renal rejection")).toBeTruthy();
    });
  });
});
