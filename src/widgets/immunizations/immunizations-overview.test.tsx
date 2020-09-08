import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import ImmunizationsOverview from "./immunizations-overview.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  patient,
  mockPatientImmunizationsSearchResponse
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
  const mockBasePath = "/";
  afterEach(() => {
    cleanup;
  });

  beforeEach(mockUseCurrentPatient.mockReset);

  it("should render without dying", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);

    mockPerformPatientImmunizationsSearch.mockResolvedValue(
      mockPatientImmunizationsSearchResponse
    );

    wrapper = render(
      <BrowserRouter>
        <ImmunizationsOverview basePath={mockBasePath} />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it("should display the patient immunizations along with recent vaccination date ", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsSearchResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <ImmunizationsOverview basePath={mockBasePath} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByText("Rotavirus")).toBeTruthy();
      expect(wrapper.getByText("Sep-2018")).toBeTruthy();
      expect(wrapper.getByText("Polio")).toBeTruthy();
      expect(wrapper.getByText("Nov-2018")).toBeTruthy();
      expect(wrapper.getByText("Influenza")).toBeTruthy();
      expect(wrapper.getByText("May-2018")).toBeTruthy();
    });
  });
});
