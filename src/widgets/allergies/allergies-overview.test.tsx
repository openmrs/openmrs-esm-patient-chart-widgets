import React from "react";
import { render, cleanup, wait } from "@testing-library/react";
import AllergyOverview from "./allergies-overview.component";
import { BrowserRouter } from "react-router-dom";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  patient,
  mockPatientAllergiesResult
} from "../../../__mocks__/allergy.mock";

const mockPerformPatientAllergySearch = performPatientAllergySearch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  performPatientAllergySearch: jest.fn().mockResolvedValue({
    data: {
      results: []
    }
  })
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<AllergyOverview/>", () => {
  let match, wrapper: any;

  afterEach(cleanup);

  beforeEach(() => {
    match = { params: {}, isExact: false, path: "/", url: "/" };
  });
  beforeEach(mockPerformPatientAllergySearch.mockReset);
  beforeEach(mockUseCurrentPatient.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("render AllergyOverview without dying", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(
      Promise.resolve(mockPatientAllergiesResult)
    );
    wrapper = render(
      <BrowserRouter>
        <AllergyOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("should display the patient allergy reaction and manifestation", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(
      Promise.resolve(mockPatientAllergiesResult)
    );
    wrapper = render(
      <BrowserRouter>
        <AllergyOverview basePath="/" />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("ACE inhibitors")).toBeTruthy();
      expect(wrapper.getByText("AMOEBIASIS (—)")).toBeTruthy();
    });
  });

  it("should not display the patient's allergies when there are no allergies", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(
      Promise.resolve({ data: { total: 0 } })
    );
    wrapper = render(
      <BrowserRouter>
        <AllergyOverview />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(
        wrapper.getByText("No Allergies recorded.").textContent
      ).toBeDefined();
    });
  });
});
