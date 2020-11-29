import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProgramsOverview from "./programs-overview.component";
import { of } from "rxjs/internal/observable/of";

import { mockEnrolledProgramsResponse } from "../../../__mocks__/programs.mock";

import { openWorkspaceTab } from "../shared-utils";
import ProgramsForm from "../programs/programs-form.component";
import { fetchActiveEnrollments } from "./programs.resource";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockFetchActiveEnrollments = fetchActiveEnrollments as jest.Mock;

const renderProgramsOverview = () =>
  render(
    <BrowserRouter>
      <ProgramsOverview basePath="/" />
    </BrowserRouter>
  );

jest.mock("./programs.resource", () => ({
  fetchActiveEnrollments: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ProgramsOverview />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
    mockFetchActiveEnrollments.mockReset;
  });

  it("should display the patient's program enrollments", async () => {
    mockFetchActiveEnrollments.mockReturnValue(
      of(mockEnrolledProgramsResponse)
    );

    renderProgramsOverview();

    await screen.findByRole("heading", { name: "Care Programs" });

    expect(screen.getByText("Care Programs")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("Active Programs")).toBeInTheDocument();
    expect(screen.getByText("Since")).toBeInTheDocument();
    expect(screen.getByText("HIV Care and Treatment")).toBeInTheDocument();
    expect(screen.getByText("Jan-2020")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See all" })).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ProgramsForm,
      "Programs Form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockFetchActiveEnrollments.mockReturnValue(of([]));

    renderProgramsOverview();

    await screen.findByRole("heading", { name: "Care Programs" });

    expect(screen.getByText("Care Programs")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(
      screen.getByText(
        /This patient has no program enrollments recorded in the system./
      )
    ).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ProgramsForm,
      "Programs Form"
    );
  });
});
