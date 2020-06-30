import React from "react";
import { render, cleanup, wait } from "@testing-library/react";
import HeightAndWeightOverview from "./heightandweight-overview.component";
import { BrowserRouter } from "react-router-dom";
import { getDimensions } from "./heightandweight.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { of } from "rxjs/internal/observable/of";

const mockGetDimensions = getDimensions as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<HeightAndWeightOverview/>", () => {
  let match, wrapper: any;

  afterEach(cleanup);

  beforeEach(() => {
    match = { params: {}, isExact: false, path: "/", url: "/" };
  });
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });
  beforeEach(mockGetDimensions.mockReset);

  it("renders HeightAndWeightOverview without dying", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));
    wrapper = render(
      <BrowserRouter>
        <HeightAndWeightOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("renders an empty state view when dimensions are absent", async () => {
    mockGetDimensions.mockReturnValue(of([]));

    wrapper = render(
      <BrowserRouter>
        <HeightAndWeightOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Add").textContent).toBeTruthy();
      expect(wrapper.getByText("Height & Weight").textContent).toBeTruthy();
      expect(
        wrapper.getByText(
          "This patient has no dimensions recorded in the system."
        ).textContent
      ).toBeTruthy();
    });
  });

  it("renders the patient's dimensions correctly", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    wrapper = render(
      <BrowserRouter>
        <HeightAndWeightOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Add").textContent).toBeTruthy();
      expect(wrapper.getByText("Height & Weight").textContent).toBeTruthy();
      expect(wrapper.getByText("Weight").textContent).toBeTruthy();
      expect(wrapper.getByText("Height").textContent).toBeTruthy();
      expect(wrapper.getByText("BMI").textContent).toBeTruthy();
      expect(wrapper.getByText("15-Apr 02:11 PM").textContent).toBeTruthy();
      expect(wrapper.getByText("85").textContent).toBeTruthy();
      expect(wrapper.getByText("kg").textContent).toBeTruthy();
      expect(wrapper.getByText("cm").textContent).toBeTruthy();
      expect(wrapper.getByText("31.2").textContent).toBeTruthy();
      expect(wrapper.getByText("kg/m").textContent).toBeTruthy();
      expect(wrapper.getByText("06-Apr 03:09 PM").textContent).toBeTruthy();
      expect(wrapper.getByText("80").textContent).toBeTruthy();
      expect(wrapper.getByText("29.4").textContent).toBeTruthy();
      expect(wrapper.getByText("cm").textContent).toBeTruthy();
      expect(wrapper.getByText("06-Apr 11:47 AM").textContent).toBeTruthy();
      expect(wrapper.getByText("186").textContent).toBeTruthy();
      expect(wrapper.getByText("see all").textContent).toBeTruthy();
    });
  });
});
