import React from "react";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockFetchPatientMedicationsResponse } from "../../../__mocks__/medication.mock";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { of } from "rxjs/internal/observable/of";
import { fetchPatientMedications } from "./medications.resource";
import MedicationLevelTwo from "./medication-level-two.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchPatientMedications = fetchPatientMedications as jest.Mock;

jest.mock("./medications.resource", () => ({
  fetchPatientMedications: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

let wrapper;

describe("<MedicationLevelTwo/>", () => {
  afterEach(cleanup);

  beforeEach(mockFetchPatientMedications.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("should render without dying", async () => {
    mockFetchPatientMedications.mockReturnValue(
      of(mockFetchPatientMedicationsResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <MedicationLevelTwo />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("should display the patient's medications correctly", async () => {
    mockFetchPatientMedications.mockReturnValue(
      of(mockFetchPatientMedicationsResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <MedicationLevelTwo />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      // Current medications
      expect(
        wrapper.getByText("Medications - current").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Add").textContent).toBeTruthy();
      expect(wrapper.getByText("NAME").textContent).toBeTruthy();
      expect(wrapper.getByText("STATUS").textContent).toBeTruthy();
      expect(wrapper.getByText("START DATE").textContent).toBeTruthy();
      expect(wrapper.getByText("ACTIONS").textContent).toBeTruthy();
      expect(wrapper.getByText("sulfadoxine").textContent).toBeTruthy();
      expect(wrapper.getByText(/oral/).textContent).toBeTruthy();
      expect(wrapper.getByText(/capsule/).textContent).toBeTruthy();
      expect(wrapper.getByText("DOSE").textContent).toBeTruthy();
      expect(wrapper.getByText("500 mg").textContent).toBeTruthy();
      expect(wrapper.getByText(/Twice daily/).textContent).toBeTruthy();
      expect(wrapper.getByText(/3 Days/).textContent).toBeTruthy();
      expect(wrapper.getByText("REFILLS").textContent).toBeTruthy();
      expect(wrapper.getByText("NEW").textContent).toBeTruthy();
      expect(wrapper.getByText("12-Feb-2020").textContent).toBeTruthy();
      expect(wrapper.getByText("Revise").textContent).toBeTruthy();
      expect(wrapper.getByText("Discontinue").textContent).toBeTruthy();
      expect(
        wrapper.getByText("No more active medications available").textContent
      ).toBeTruthy();
      // Past medications
      expect(wrapper.getByText("Medications - past").textContent).toBeTruthy();
      expect(
        wrapper.getByText("No past medications are documented.").textContent
      ).toBeTruthy();
    });
  });

  it("should not display the patient's medications when they are absent", async () => {
    mockFetchPatientMedications.mockReturnValue(of([]));

    wrapper = render(
      <BrowserRouter>
        <MedicationLevelTwo />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Medications").textContent).toBeTruthy();
      expect(
        wrapper.getByText("The patient's medication history is not documented.")
          .textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("Add medication history").textContent
      ).toBeTruthy();
    });
  });
});
