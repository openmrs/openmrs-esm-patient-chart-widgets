import React from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { render, cleanup, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";
import {
  patient,
  mockPatientImmunizationsResult
} from "../../../__mocks__/immunizations.mock";

const mockPerformPatientImmunizationsSearch = performPatientImmunizationsSearch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("./immunizations.resource", () => ({
  performPatientImmunizationsSearch: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ImmunizationsDetailedSummary />", () => {
  let wrapper: any;

  afterEach(cleanup);
  beforeEach(mockPerformPatientImmunizationsSearch.mockReset);
  beforeEach(mockUseCurrentPatient.mockReset);

  it("renders without dying", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsResult)
    );
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("should display the patient's immunizations correctly", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsResult)
    );
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Renal rejection").textContent).toBeTruthy();
      expect(wrapper.getByText("Overweight").textContent).toBeTruthy();
      expect(wrapper.getByText("Fever").textContent).toBeTruthy();
      expect(wrapper.getByText("Hypertension").textContent).toBeTruthy();
    });
  });

  it("should not display the patients immunizations when no immunization is returned", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve({ data: { total: 0 } })
    );
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(
        wrapper.getByText("No Immunizations are documented.").textContent
      ).toBeDefined();
    });
  });
});
