import React from "react";
import { BrowserRouter } from "react-router-dom";
import HeightAndWeightRecord from "./heightandweight-record.component";
import { getDimensions } from "./heightandweight.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { render, wait, cleanup } from "@testing-library/react";
import { of } from "rxjs";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockGetDimensions = getDimensions as jest.Mock;

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  fhirConfig: { baseUrl: "/ws/fhir2" }
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn()
}));

describe("<HeightAndWeightRecord/>", () => {
  let patient: fhir.Patient = mockPatient;
  beforeEach(() => {
    mockUseCurrentPatient.mockReset();
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  afterEach(cleanup);

  it("render withour dying", () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));
    <BrowserRouter>
      <HeightAndWeightRecord />
    </BrowserRouter>;
  });

  it("should display the height, weight, bmi correctly", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));
    const wrapper = render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );

    expect(wrapper).toBeTruthy();
    expect(wrapper.getByText("Height & Weight").textContent).toBeTruthy();
    expect(wrapper.getByText("Measured at").textContent).toBeTruthy();
    expect(wrapper.getByText("Weight").textContent).toBeTruthy();
    expect(wrapper.getByText("85").textContent).toBeTruthy();
    expect(wrapper.getByText("kg").textContent).toBeTruthy();
    expect(wrapper.getByText("187.43").textContent).toBeTruthy();
    expect(wrapper.getByText("lbs").textContent).toBeTruthy();
    expect(wrapper.getByText("Height").textContent).toBeTruthy();
    expect(wrapper.getByText("165").textContent).toBeTruthy();
    expect(wrapper.getByText("cm").textContent).toBeTruthy();
    expect(wrapper.getByText("feet").textContent).toBeTruthy();
    expect(wrapper.getByText("inches").textContent).toBeTruthy();
    expect(wrapper.getByText("BMI").textContent).toBeTruthy();
    expect(wrapper.getByText("31.2").textContent).toBeTruthy();
    expect(wrapper.getByText("Kg/m2").textContent).toBeTruthy();
    expect(wrapper.getByText("Details").textContent).toBeTruthy();
    expect(wrapper.getByText("Last updated").textContent).toBeTruthy();
    expect(wrapper.getByText("Last updated by").textContent).toBeTruthy();
    expect(wrapper.getByText("Last updated location").textContent).toBeTruthy();
  });

  it("should display error message when response is empty", async () => {
    mockGetDimensions.mockReturnValue(of([]));
    const wrapper = render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(
        wrapper.getByText("The patient's Height and Weight is not documented.")
      ).toBeTruthy();
      expect(wrapper.getByText("add patient height and weight")).toBeTruthy();
    });
  });
});
