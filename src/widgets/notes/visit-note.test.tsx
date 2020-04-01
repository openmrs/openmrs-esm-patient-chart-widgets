import React from "react";
import { BrowserRouter } from "react-router-dom";
import VisitsNote from "./visit-note.component";
import {
  fetchAllLoccations,
  fetchAllProviders,
  fetchCurrentSessionData,
  fetchDiagnosisByName
} from "./visit-notes.resource";
import * as visitResource from "./visit-notes.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  locationsResponse,
  providersResponse,
  currentSessionResponse,
  diagnosisSearchResponse
} from "../../../__mocks__/visit-note.mock";
import {
  RenderResult,
  render,
  wait,
  cleanup,
  fireEvent
} from "@testing-library/react";
import { of } from "rxjs";
import { act } from "react-dom/test-utils";

const mockFetchAllLocations = fetchAllLoccations as jest.Mock;
const mockFetchAllProviders = fetchAllProviders as jest.Mock;
const mockFetchCurrentSessionsData = fetchCurrentSessionData as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("./visit-notes.resource", () => ({
  fetchAllLoccations: jest.fn(),
  fetchAllProviders: jest.fn(),
  fetchCurrentSessionData: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<VisitNote>", () => {
  let patient: fhir.Patient = mockPatient;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it("render without dying", () => {
    <BrowserRouter>
      <VisitsNote />
    </BrowserRouter>;
  });

  it("render and prefill location and providers with current session data", async () => {
    mockFetchAllLocations.mockReturnValue(Promise.resolve(locationsResponse));
    mockFetchAllProviders.mockReturnValue(Promise.resolve(providersResponse));
    mockFetchCurrentSessionsData.mockReturnValue(
      Promise.resolve(currentSessionResponse)
    );

    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);

    const { getByTestId, getByDisplayValue, getByText }: RenderResult = render(
      <BrowserRouter>
        <VisitsNote />
      </BrowserRouter>
    );

    await wait(() => {
      expect(getByText("Visit Note")).toBeTruthy();
      expect(getByDisplayValue("User 2")).toBeTruthy();
      expect(getByDisplayValue("Inpatient Ward")).toBeTruthy();
      expect(fetchAllLoccations).toHaveBeenCalled();
      expect(fetchAllProviders).toHaveBeenCalled();
    });
  });
});
