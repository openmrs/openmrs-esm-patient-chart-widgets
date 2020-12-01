import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { getEncounterObservableRESTAPI } from "./encounter.resource";

import { mockPatientEncountersRESTAPI } from "../../../__mocks__/encounters.mock";
import NotesDetailedSummary from "./notes-detailed-summary.component";

const mockGetEncounterObservableRESTAPI = getEncounterObservableRESTAPI as jest.Mock;

jest.mock("./encounter.resource", () => ({
  getEncounterObservableRESTAPI: jest.fn()
}));

jest.mock("lodash", () => ({
  capitalize: jest
    .fn()
    .mockImplementation(s => s.charAt(0).toUpperCase() + s.slice(1)),
  isEmpty: jest.fn().mockImplementation(arr => arr.length === 0)
}));

describe("<NotesDetailedSummary />", () => {
  afterEach(() => {
    mockGetEncounterObservableRESTAPI.mockReset();
  });

  beforeEach(() => {
    mockGetEncounterObservableRESTAPI.mockReturnValue(
      of(mockPatientEncountersRESTAPI.results)
    );
  });

  it("displays the patient's encounter notes correctly", async () => {
    render(
      <BrowserRouter>
        <NotesDetailedSummary />
      </BrowserRouter>
    );

    await expect(
      screen.getByRole("heading", { name: "Notes" })
    ).toBeInTheDocument();

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText(/19-Feb/)).toBeInTheDocument();
    expect(screen.getByText("Isolation Ward")).toBeInTheDocument();
    expect(screen.getByText("JJ Dick")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
    const prevButton = screen.getByRole("button", { name: "Previous" });
    expect(prevButton).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    fireEvent.click(nextButton);
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });
});
