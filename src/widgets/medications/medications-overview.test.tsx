import React from "react";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockFetchPatientMedicationsResponse } from "../../../__mocks__/medication.mock";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MedicationsOverview from "./medications-overview.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import { fetchPatientMedications } from "./medications.resource";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchPatientMedications = fetchPatientMedications as jest.Mock;

jest.mock("./medications.resource", () => ({
  fetchPatientMedications: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

let wrapper;

describe("<MedicationsOverview/>", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
    mockFetchPatientMedications.mockReset;
  });

  it("renders without dying", async () => {
    mockFetchPatientMedications.mockReturnValue(
      of(mockFetchPatientMedicationsResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <MedicationsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it("should display the patients medications correctly", async () => {
    mockFetchPatientMedications.mockReturnValue(
      of(mockFetchPatientMedicationsResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <MedicationsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Active Medications").textContent).toBeTruthy();
      expect(wrapper.getByText("Add").textContent).toBeTruthy();
      expect(wrapper.getByText("sulfadoxine").textContent).toBeTruthy();
      expect(wrapper.getByText("DOSE").textContent).toBeTruthy();
      expect(wrapper.getByText("500 mg").textContent).toBeTruthy();
      expect(wrapper.getByText("capsule").textContent).toBeTruthy();
      expect(wrapper.getByText("oral").textContent).toBeTruthy();
      expect(wrapper.getByText(/Twice daily/).textContent).toBeTruthy();
      expect(wrapper.getByText("Revise")).toBeTruthy();
      expect(wrapper.getByText("Discontinue")).toBeTruthy();
      expect(wrapper.getByText("See all")).toBeTruthy();
    });
  });

  it("should not display the patient medications when medications are absent", async () => {
    mockFetchPatientMedications.mockReturnValue(of([]));

    wrapper = render(
      <BrowserRouter>
        <MedicationsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Active Medications").textContent).toBeTruthy();
      expect(
        wrapper.getByText("No Active Medications recorded.").textContent
      ).toBeTruthy();
    });
  });
});
