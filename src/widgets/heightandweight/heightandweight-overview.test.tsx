import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import HeightAndWeightOverview from "./heightandweight-overview.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import { getDimensionsObservationsRestAPI } from "./heightandweight.resource";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { of } from "rxjs/internal/observable/of";
import { BrowserRouter } from "react-router-dom";
import { mockHeightAndWeightResponse } from "../../../__mocks__/height-and-weight.mock";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockGetDimensionsObservableRestAPI = getDimensionsObservationsRestAPI as jest.Mock;

jest.mock("./heightandweight.resource", () => ({
  getDimensionsObservationsRestAPI: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

let wrapper;

describe("<HeightAndWeightOverview/>", () => {
  afterEach(cleanup);

  beforeEach(mockGetDimensionsObservableRestAPI.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("renders without dying", async () => {
    mockGetDimensionsObservableRestAPI.mockReturnValue(
      of(mockHeightAndWeightResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <HeightAndWeightOverview />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });

  it("displays the patient's dimensions correctly", async () => {
    mockGetDimensionsObservableRestAPI.mockReturnValue(
      of(mockHeightAndWeightResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <HeightAndWeightOverview />
      </BrowserRouter>
    );

    expect(wrapper.getByText("Weight").textContent).toBeDefined();
    expect(wrapper.getByText("Height").textContent).toBeDefined();
    expect(wrapper.getByText("BMI").textContent).toBeDefined();
    expect(wrapper.getByText("13-Jan 10:35 AM").textContent).toBeDefined();
    expect(wrapper.getByText("13-Jan 10:30 AM").textContent).toBeDefined();
    expect(wrapper.getByText("13-Jan 10:20 AM").textContent).toBeDefined();
  });

  it("should not display the patient's dimensions when dimensions data is absent", async () => {
    mockGetDimensionsObservableRestAPI.mockReturnValue(of(null));

    wrapper = render(
      <BrowserRouter>
        <HeightAndWeightOverview />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(
        wrapper.getByText("No Dimensions recorded.").textContent
      ).toBeTruthy();
    });
  });
});
