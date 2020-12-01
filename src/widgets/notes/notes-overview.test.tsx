import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { mockPatientEncountersRESTAPI } from "../../../__mocks__/encounters.mock";
import { getEncounterObservableRESTAPI } from "./encounter.resource";
import NotesOverview from "./notes-overview.component";

const mockGetEncounterObservableRESTAPI = getEncounterObservableRESTAPI as jest.Mock;

const renderNotesOverview = () => {
  render(
    <BrowserRouter>
      <NotesOverview basePath="/" />
    </BrowserRouter>
  );
};

jest.mock("./encounter.resource", () => ({
  getEncounters: jest.fn(),
  getEncounterObservableRESTAPI: jest.fn()
}));

describe("<NotesOverview/>", () => {
  beforeEach(mockGetEncounterObservableRESTAPI.mockReset);

  it("renders an empty state view when dimensions are absent", async () => {
    mockGetEncounterObservableRESTAPI.mockReturnValue(of([]));

    renderNotesOverview();

    await screen.findByText("Notes");
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(
      screen.getByText("There are no notes to display for this patient")
    ).toBeInTheDocument();
  });

  it("renders an overview of the patient's encounter notes when present", async () => {
    mockGetEncounterObservableRESTAPI.mockReturnValue(
      of(mockPatientEncountersRESTAPI.results)
    );

    renderNotesOverview();

    expect(screen.getByText("Notes")).toBeInTheDocument();

    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Encounter type/i)).toBeInTheDocument();
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Author/i)).toBeInTheDocument();
  });
});
