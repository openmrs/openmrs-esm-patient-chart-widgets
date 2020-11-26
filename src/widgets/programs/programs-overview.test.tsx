import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProgramsOverview from "./programs-overview.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockEnrolledProgramsResponse } from "../../../__mocks__/programs.mock";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { openWorkspaceTab } from "../shared-utils";
import ProgramsForm from "../programs/programs-form.component";
import { of } from "rxjs/internal/observable/of";
import { fetchActiveEnrollments } from "./programs.resource";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockFetchActiveEnrollments = fetchActiveEnrollments as jest.Mock;

jest.mock("./programs.resource", () => ({
  fetchActiveEnrollments: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ProgramsOverview />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockFetchActiveEnrollments.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("should display the patient's program enrollments", async () => {
    mockFetchActiveEnrollments.mockReturnValue(
      of(mockEnrolledProgramsResponse)
    );

    render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );

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

    render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );

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
