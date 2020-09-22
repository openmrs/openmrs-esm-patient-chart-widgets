import React from "react";
import { BrowserRouter } from "react-router-dom";
import VisitsNote from "./visit-note.component";
import {
  fetchAllLocations,
  fetchAllProviders,
  fetchCurrentSessionData,
  fetchDiagnosisByName
} from "./visit-notes.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  locationsResponse,
  providersResponse,
  currentSessionResponse,
  diagnosisSearchResponse
} from "../../../__mocks__/visit-note.mock";
import { screen, render, fireEvent, wait } from "@testing-library/react";
import { of } from "rxjs";
import { act } from "react-dom/test-utils";

const mockFetchAllLocations = fetchAllLocations as jest.Mock;
const mockFetchAllProviders = fetchAllProviders as jest.Mock;
const mockFetchCurrentSessionsData = fetchCurrentSessionData as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchDiagnosisByName = fetchDiagnosisByName as jest.Mock;

jest.mock("./visit-notes.resource", () => ({
  fetchAllLocations: jest.fn(),
  fetchAllProviders: jest.fn(),
  fetchCurrentSessionData: jest.fn(),
  fetchDiagnosisByName: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<VisitNote>", () => {
  let patient: fhir.Patient = mockPatient;

  beforeEach(() => {
    mockFetchAllLocations.mockReturnValue(Promise.resolve(locationsResponse));
    mockFetchAllProviders.mockReturnValue(Promise.resolve(providersResponse));
    mockFetchCurrentSessionsData.mockReturnValue(
      Promise.resolve(currentSessionResponse)
    );

    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockFetchDiagnosisByName.mockReturnValue(of(diagnosisSearchResponse));
  });

  afterEach(() => {
    mockFetchAllLocations.mockReset();
    mockFetchAllProviders.mockReset();
    mockFetchCurrentSessionsData.mockReset();
    mockFetchCurrentSessionsData.mockReset();
    mockUseCurrentPatient.mockReset();
  });

  it("render without dying", () => {
    <BrowserRouter>
      <VisitsNote />
    </BrowserRouter>;
  });

  it("render and prefill location and providers with current session data", async () => {
    render(
      <BrowserRouter>
        <VisitsNote />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Visit Note/)).toBeTruthy();
    expect(await screen.findByText("User 2")).toBeTruthy();
    expect(await screen.findByText("Inpatient Ward")).toBeTruthy();
    expect(fetchAllLocations).toHaveBeenCalled();
    expect(fetchAllProviders).toHaveBeenCalled();
  });

  it("should enable save buttons when clinicalNote or diagnosis is selected", async () => {
    const { container } = render(
      <BrowserRouter>
        <VisitsNote />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Save/)).toBeDisabled();
    const clinicalNoteInput = await screen.findByLabelText(/Clinical Note/);
    fireEvent.change(clinicalNoteInput, {
      target: { value: "Sample Clinical Note" }
    });
    expect(await screen.findByText(/Save/)).not.toBeDisabled();
  });
});
