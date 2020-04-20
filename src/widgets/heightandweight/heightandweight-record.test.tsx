import React from "react";
import { BrowserRouter } from "react-router-dom";
import HeightAndWeightRecord from "./heightandweight-record.component";
import { useCurrentPatient, openmrsObservableFetch } from "@openmrs/esm-api";
import { mockDimensionResponse } from "../../../__mocks__/dimensions.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { render, wait, cleanup, getByText } from "@testing-library/react";
import { of } from "rxjs";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  openmrsObservableFetch: jest.fn(),
  fhirConfig: { baseUrl: "/ws/fhir2" }
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn()
}));

describe("<HeightAndWeightRecord/>", () => {
  let patient: fhir.Patient = mockPatient;
  beforeEach(() => {
    mockOpenmrsObservableFetch.mockReset();
    mockUseCurrentPatient.mockReset();
  });

  afterEach(cleanup);

  it("render withour dying", () => {
    mockOpenmrsObservableFetch.mockReturnValue(of(mockDimensionResponse));
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    <BrowserRouter>
      <HeightAndWeightRecord />
    </BrowserRouter>;
  });

  it("should display the height, weight, bmi correctly", async () => {
    jest.setTimeout(7000);
    mockOpenmrsObservableFetch.mockReturnValue(of(mockDimensionResponse));
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    const { container } = render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );
  });

  it("should display error message when response is empty", async () => {
    mockOpenmrsObservableFetch.mockReturnValue(
      of({
        data: {
          entry: []
        }
      })
    );
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
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
