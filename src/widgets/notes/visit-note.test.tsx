import React from "react";
import { BrowserRouter } from "react-router-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import {
  fetchAllLocations,
  fetchAllProviders,
  fetchCurrentSessionData,
  fetchDiagnosisByName
} from "./visit-notes.resource";
import VisitsNote from "./visit-notes-form.component";
import {
  locationsResponse,
  providersResponse,
  currentSessionResponse,
  diagnosisSearchResponse
} from "../../../__mocks__/visit-note.mock";

const mockFetchAllLocations = fetchAllLocations as jest.Mock;
const mockFetchAllProviders = fetchAllProviders as jest.Mock;
const mockFetchCurrentSessionsData = fetchCurrentSessionData as jest.Mock;
const mockFetchDiagnosisByName = fetchDiagnosisByName as jest.Mock;

const renderVisitNote = () =>
  render(
    <BrowserRouter>
      <VisitsNote />
    </BrowserRouter>
  );

jest.mock("./visit-notes.resource", () => ({
  fetchAllLocations: jest.fn(),
  fetchAllProviders: jest.fn(),
  fetchCurrentSessionData: jest.fn(),
  fetchDiagnosisByName: jest.fn()
}));

describe("<VisitNote>", () => {
  beforeEach(() => {
    mockFetchAllLocations.mockReturnValue(Promise.resolve(locationsResponse));
    mockFetchAllProviders.mockReturnValue(Promise.resolve(providersResponse));
    mockFetchCurrentSessionsData.mockReturnValue(
      Promise.resolve(currentSessionResponse)
    );
    mockFetchDiagnosisByName.mockReturnValue(of(diagnosisSearchResponse));
  });

  afterEach(() => jest.restoreAllMocks());

  it("renders and prefill location and providers with current session data", async () => {
    renderVisitNote();

    await screen.findByText("Visit Note");

    expect(screen.getByText(/Visit Note/)).toBeTruthy();
    expect(screen.getByText("User 2")).toBeTruthy();
    expect(screen.getByText("Inpatient Ward")).toBeTruthy();
    expect(fetchAllLocations).toHaveBeenCalled();
    expect(fetchAllProviders).toHaveBeenCalled();
  });

  it("should enable save buttons when clinicalNote or diagnosis is selected", async () => {
    renderVisitNote();

    await screen.findByText("Visit Note");
    expect(screen.getByText(/Save/)).toBeDisabled();

    const clinicalNoteInput = await screen.findByLabelText(/Clinical Note/);
    fireEvent.change(clinicalNoteInput, {
      target: { value: "Sample Clinical Note" }
    });

    expect(screen.getByText(/Save/)).not.toBeDisabled();
  });
});
