import {
  mockImmunizationConfig,
  mockPatientImmunizationsSearchResponse,
  patient
} from "../../../__mocks__/immunizations.mock";
import { render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { openmrsFetch, useCurrentPatient } from "@openmrs/esm-api";
import ImmunizationsDetailedSummary from "../Immunizations/immunizations-detailed-summary.component";
import React from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";

const mockPerformPatientImmunizationsSearch = performPatientImmunizationsSearch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenmrsFetch = openmrsFetch as jest.Mock;

jest.mock("./immunizations.resource", () => ({
  performPatientImmunizationsSearch: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  openmrsFetch: jest.fn()
}));

describe("<ImmunizationsDetailedSummary />", () => {
  let wrapper: any;

  it("should render detailed summary from config and search results", async () => {
    jest.setTimeout(30000);
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsSearchResponse)
    );
    mockOpenmrsFetch.mockReturnValue(
      Promise.resolve({ data: mockImmunizationConfig })
    );
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Rotavirus")).toBeTruthy();
      expect(wrapper.getByText("4 Months on 21-Sep-2018")).toBeTruthy();
      expect(wrapper.getByText("Polio")).toBeTruthy();
      expect(wrapper.getByText("4 Months on 01-Nov-2018")).toBeTruthy();

      expect(wrapper.getByText("Influenza")).toBeTruthy();
      expect(wrapper.getByText("Adenovirus")).toBeTruthy();
    });
  });
});
