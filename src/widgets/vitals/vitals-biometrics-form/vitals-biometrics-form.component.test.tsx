import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VitalsAndBiometricForms from "./vitals-biometrics-form.component";
import { savePatientVitals } from "../vitals-biometrics.resource";
import { mockSessionDataResponse } from "../../../../__mocks__/session.mock";
import { openmrsObservableFetch } from "@openmrs/esm-api";
import { of } from "rxjs";

const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;
const mockSavePatientVitals = savePatientVitals as jest.Mock;
const mockCloseWorkspace = jest.fn();

jest.mock("@openmrs/esm-api", () => ({
  openmrsObservableFetch: jest.fn()
}));

jest.mock("../vitals-biometrics.resource", () => ({
  savePatientVitals: jest.fn()
}));

window.getOpenmrsSpaBase = jest.fn();
describe("<VitalsBiometricsForm/>", () => {
  const mockVitalsBiometricsFormProps = { closeworkSpace: mockCloseWorkspace };

  beforeEach(() => {
    mockOpenmrsObservableFetch.mockImplementation(() =>
      of(mockSessionDataResponse)
    );
    render(
      <VitalsAndBiometricForms
        closeWorkspace={mockVitalsBiometricsFormProps.closeworkSpace}
      />
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it("should close form when cancel button is clicked", () => {
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    userEvent.click(cancelButton);
    expect(mockCloseWorkspace).toHaveBeenCalledTimes(1);
  });

  it("should save patient vitals and biometrics and close form", async () => {
    const saveButton = screen.getByRole("button", { name: /Sign & Save/i });
    userEvent.type(screen.getByTitle(/Respiration Rate/i), "70");
    userEvent.type(screen.getByTitle(/Temp/i), "36.5");
    userEvent.type(screen.getByTitle(/Sp02/i), "93");
    userEvent.type(screen.getByTitle(/Heart Rate/i), "29");
    userEvent.type(screen.getByTitle(/systolic/i), "120");
    userEvent.type(screen.getByTitle(/diastolic/i), "80");
    userEvent.type(screen.getByTitle(/Notes/i), "Patient vitals okay");
    userEvent.type(screen.getByTitle(/Weight/i), "70");
    userEvent.type(screen.getByTitle(/Height/i), "165");
    userEvent.type(screen.getByTitle(/MUAC/i), "28");
    mockSavePatientVitals.mockImplementation(() =>
      Promise.resolve({ status: 201 })
    );
    userEvent.click(saveButton);
    expect(mockSavePatientVitals).toHaveBeenCalled();
    expect(mockCloseWorkspace).toHaveBeenCalled();
  });
});
