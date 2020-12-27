import React from "react";

import { BrowserRouter } from "react-router-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { switchTo } from "@openmrs/esm-extensions";
import { ConfigMock } from "../../../__mocks__/chart-widgets-config.mock";
import {
  fetchCurrentSessionData,
  fetchDiagnosisByName,
  fetchLocationByUuid,
  fetchProviderByUuid,
  saveVisitNote
} from "./visit-notes.resource";
import {
  currentSessionResponse,
  diagnosisSearchResponse,
  mockFetchLocationByUuidResponse,
  mockFetchProviderByUuidResponse
} from "../../../__mocks__/visit-note.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import VisitNotesForm from "./visit-notes-form.component";

const mockFetchCurrentSessionData = fetchCurrentSessionData as jest.Mock;
const mockFetchDiagnosisByName = fetchDiagnosisByName as jest.Mock;
const mockFetchLocationByUuid = fetchLocationByUuid as jest.Mock;
const mockFetchProviderByUuid = fetchProviderByUuid as jest.Mock;
const mockSaveVisitNote = saveVisitNote as jest.Mock;
const mockSwitchTo = switchTo as jest.Mock;

jest.mock("./visit-notes.resource", () => ({
  fetchCurrentSessionData: jest.fn(),
  fetchDiagnosisByName: jest.fn(),
  fetchLocationByUuid: jest.fn(),
  fetchProviderByUuid: jest.fn(),
  saveVisitNote: jest.fn()
}));

let mockConfig = ConfigMock;
const renderVisitNotesForm = () => {
  render(
    <BrowserRouter>
      <VisitNotesForm config={mockConfig} />
    </BrowserRouter>
  );
};

describe("Visit notes form", () => {
  beforeEach(() => {
    mockFetchCurrentSessionData.mockResolvedValue(currentSessionResponse);
    mockFetchDiagnosisByName.mockReturnValue(
      of(diagnosisSearchResponse.results)
    );
    mockFetchLocationByUuid.mockResolvedValue(mockFetchLocationByUuidResponse);
    mockFetchProviderByUuid.mockResolvedValue(mockFetchProviderByUuidResponse);
  });

  it("renders the visit notes form successfully", async () => {
    renderVisitNotesForm();

    await screen.findByText(/Add a Visit Note/i);

    expect(
      screen.getByRole("heading", { name: /Add a Visit Note/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Visit Date")).toBeInTheDocument();
    expect(screen.getByText("Diagnosis")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save & Close/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("typing in the diagnosis search input triggers a search", async () => {
    renderVisitNotesForm();

    await screen.findByText(/Add a Visit Note/i);

    const diagnosisSearchbox = screen.getByRole("searchbox");
    fireEvent.change(diagnosisSearchbox, {
      target: { value: "Diabetes Mellitus" }
    });

    await screen.findByText("Diabetes Mellitus");

    expect(screen.getByText("Diabetes Mellitus")).toBeInTheDocument();
    expect(screen.getByText("Diabetes Mellitus, Type II")).toBeInTheDocument();

    // clicking on a search result displays the selected diagnosis as a tag
    fireEvent.click(screen.getByText("Diabetes Mellitus"));

    await screen.findByTitle("Diabetes Mellitus");

    const diabetesMellitusTag = screen.getByLabelText(
      "Clear filter Diabetes Mellitus"
    );
    expect(diabetesMellitusTag).toHaveAttribute(
      "class",
      expect.stringContaining("bx--tag--red")
    ); // primary diagnosis tags have a red background

    const closeTagButton = screen.getByRole("button", {
      name: "Clear filter Diabetes Mellitus"
    });

    // Clicking the close button on the tag removes the selected diagnosis
    fireEvent.click(closeTagButton);

    await screen.findByText(/No diagnosis selected/i);

    // no selected diagnoses left
    expect(
      screen.getByText(/No diagnosis selected — Enter a diagnosis below/i)
    ).toBeInTheDocument();
  });

  it("clicking 'Cancel' closes the form", async () => {
    renderVisitNotesForm();

    await screen.findByRole("button", { name: "Cancel" });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockSwitchTo).toHaveBeenCalledTimes(1);
  });

  it("clicking 'Save & Close' submits the form ", async () => {
    renderVisitNotesForm();

    const testPayload = {
      encounterProviders: jasmine.arrayContaining([
        {
          encounterRole: mockConfig.visitNoteConfig.clinicianEncounterRole,
          provider: mockFetchProviderByUuidResponse.data.uuid
        }
      ]),
      encounterType: mockConfig.visitNoteConfig.encounterTypeUuid,
      form: mockConfig.visitNoteConfig.formConceptUuid,
      location: mockFetchLocationByUuidResponse.data.uuid,
      obs: jasmine.arrayContaining([
        {
          concept: mockConfig.visitNoteConfig.encounterNoteConceptUuid,
          value: "Sample clinical note"
        },
        undefined
      ]),
      patient: mockPatient.id
    };

    mockSaveVisitNote.mockResolvedValue(testPayload);

    await screen.findByText(/Add a Visit Note/i);

    // Select 'diabetes mellitus' as primary diagnosis
    const diagnosisSearchbox = screen.getByRole("searchbox");
    fireEvent.change(diagnosisSearchbox, {
      target: { value: "Diabetes Mellitus" }
    });

    await screen.findByText("Diabetes Mellitus");

    fireEvent.click(screen.getByText("Diabetes Mellitus"));

    const clinicalNote = screen.getByRole("textbox", { name: "" });
    fireEvent.change(clinicalNote, {
      target: { value: "Sample clinical note" }
    });

    await screen.findByDisplayValue("Sample clinical note");

    const submitBtn = screen.getByRole("button", { name: /Save & Close/i });
    fireEvent.click(submitBtn);

    await screen.findByText(/Add a Visit Note/i);

    expect(mockSaveVisitNote).toHaveBeenCalledTimes(1);
    expect(mockSaveVisitNote).toHaveBeenCalledWith(
      new AbortController(),
      jasmine.objectContaining(testPayload)
    );
  });
});
