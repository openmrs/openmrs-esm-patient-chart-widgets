import React from "react";
import { getPatientAllergyByPatientUuid } from "./allergy-intolerance.resource";
import { render, cleanup, wait } from "@testing-library/react";
import { BrowserRouter, match, useRouteMatch } from "react-router-dom";
import AllergyRecord from "./allergy-record.component";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { patient, mockAllergyResult } from "../../../__mocks__/allergy.mock";

const mockGetPatientAllergyByPatientUuid = getPatientAllergyByPatientUuid as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  getPatientAllergyByPatientUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

describe("<AllergyCardLevelThree />", () => {
  let match: match = {
    params: { allergyUuid: "8673ee4f-e2ab-4077-ba55-4980f408773e" },
    isExact: false,
    path: "/",
    url: "/"
  };
  let wrapper: any;

  afterEach(cleanup);
  beforeEach(mockGetPatientAllergyByPatientUuid.mockReset);
  beforeEach(mockUseCurrentPatient.mockReset);
  beforeEach(mockUseRouteMatch.mockReset);

  it("renders without dying", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockGetPatientAllergyByPatientUuid.mockReturnValue(
      Promise.resolve(mockAllergyResult)
    );
    mockUseRouteMatch.mockReturnValue(match);
    wrapper = render(
      <BrowserRouter>
        <AllergyRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("displays detailed information about a specific allergy", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockGetPatientAllergyByPatientUuid.mockReturnValue(
      Promise.resolve(mockAllergyResult)
    );
    mockUseRouteMatch.mockReturnValue(match);
    wrapper = render(
      <BrowserRouter>
        <AllergyRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByTestId("severity").textContent).toEqual("Mild");
      expect(wrapper.getByTestId("reaction").textContent).toEqual(
        "Mental status change"
      );
      expect(wrapper.getByTestId("onset-date").textContent).toEqual("-");
      expect(wrapper.getByTestId("comment").textContent).toEqual(
        "The patient is showing a mild reaction to the above allergens"
      );
      expect(wrapper.getByTestId("last-updated").textContent).toMatch(
        /0[23]-Jan-2020/
      ); // allow for time zones
      expect(wrapper.getByTestId("updated-by").textContent).toEqual("doc");
      expect(wrapper.getByTestId("update-location").textContent).toEqual("-");
    });
  });
});
