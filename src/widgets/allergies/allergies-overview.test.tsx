import React from "react";
import { render, cleanup, wait } from "@testing-library/react";
import AllergiesOverview from "./allergies-overview.component";
import { BrowserRouter } from "react-router-dom";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  patient,
  mockPatientAllergyResult
} from "../../../__mocks__/allergy.mock";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockPerformPatientAllergySearch = performPatientAllergySearch as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  performPatientAllergySearch: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<AllergiesOverview />", () => {
  let match, wrapper: any;

  afterEach(cleanup);

  beforeEach(() => {
    match = { params: {}, isExact: false, path: "/", url: "/" };
  });
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });
  beforeEach(mockPerformPatientAllergySearch.mockReset);

  it("render AllergiesOverview without dying", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(
      Promise.resolve(mockPatientAllergyResult)
    );

    wrapper = render(
      <BrowserRouter>
        <AllergiesOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("renders an empty state view when allergies are absent", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(Promise.resolve([]));

    wrapper = render(
      <BrowserRouter>
        <AllergiesOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Add").textContent).toBeTruthy();
      expect(wrapper.getByText("Allergies").textContent).toBeTruthy();
      expect(
        wrapper.getByText(
          "This patient has no allergy intolerances recorded in the system."
        ).textContent
      ).toBeTruthy();
    });
  });

  it("should display the patient's allergic reactions and their manifestations", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(
      Promise.resolve(mockPatientAllergyResult)
    );
    wrapper = render(
      <BrowserRouter>
        <AllergiesOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByText("Allergies")).toBeTruthy();
      expect(wrapper.getByText("Add")).toBeTruthy();
      expect(wrapper.getByText("ACE inhibitors")).toBeTruthy();
      expect(wrapper.getByText("AMOEBIASIS (—)")).toBeTruthy();
    });
  });
});
