import React from "react";

import { of } from "rxjs";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { mockFormattedNotes } from "../../../__mocks__/encounters.mock";
import { getEncounterObservableRESTAPI } from "./encounter.resource";
import { openWorkspaceTab } from "../shared-utils";
import NotesOverview from "./notes-overview.component";
import VisitNotes from "./visit-notes-form.component";

const mockGetEncounterObservableRESTAPI = getEncounterObservableRESTAPI as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./encounter.resource", () => ({
  getEncounters: jest.fn(),
  getEncounterObservableRESTAPI: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<NotesOverview />", () => {
  beforeEach(() => {
    mockGetEncounterObservableRESTAPI.mockReset;
    mockOpenWorkspaceTab.mockReset;
  });

  it("should display the patients encounter notes", async () => {
    mockGetEncounterObservableRESTAPI.mockReturnValue(of(mockFormattedNotes));

    render(
      <BrowserRouter>
        <NotesOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByText("Notes");
    expect(screen.getByRole("heading", { name: "Notes" })).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Encounter type")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    expect(screen.getByText("Isolation Ward")).toBeInTheDocument();
    expect(screen.getByText("Dr. G. Testerson")).toBeInTheDocument();

    // Clicking "Add" launches the notes form in a new workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VisitNotes,
      "Visit note form"
    );
  });

  it("renders an empty state view when encounter data is absent", async () => {
    mockGetEncounterObservableRESTAPI.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <NotesOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Notes" });

    expect(screen.getByText(/Notes/)).toBeInTheDocument();
    expect(screen.getByText(/There are no notes to display for this patient/))
      .toBeInTheDocument;
    expect(screen.getByText(/Record notes/)).toBeInTheDocument;
  });
});
