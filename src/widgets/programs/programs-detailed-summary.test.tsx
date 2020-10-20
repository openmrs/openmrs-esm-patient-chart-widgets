import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, Prompt } from "react-router-dom";
import ProgramsDetailedSummary from "./programs-detailed-summary.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockEnrolledProgramsResponse } from "../../../__mocks__/programs.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { fetchEnrolledPrograms } from "./programs.resource";
import { openWorkspaceTab } from "../shared-utils";
import ProgramsForm from "./programs-form.component";
import { of } from "rxjs/internal/observable/of";

const mockFetchEnrolledPrograms = fetchEnrolledPrograms as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./programs.resource", () => ({
  fetchEnrolledPrograms: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ProgramsDetailedSummary />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockFetchEnrolledPrograms.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("displays a detailed summary of the patient's program enrollments", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

    render(
      <BrowserRouter>
        <ProgramsDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Care Programs" });
    expect(screen.getByText("Care Programs")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("Active Programs")).toBeInTheDocument();
    expect(screen.getByText("Since")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("HIV Care and Treatment")).toBeInTheDocument();
    expect(screen.getByText("Jan-2020")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ProgramsForm,
      "Programs Form",
      {
        setEnrolledPrograms: expect.anything(),
        enrolledPrograms: mockEnrolledProgramsResponse
      }
    );
  });

  it("renders an empty state view when program enrollment data is absent", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of({}));

    render(
      <BrowserRouter>
        <ProgramsDetailedSummary />
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
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ProgramsForm,
      "Programs Form",
      {
        setEnrolledPrograms: expect.anything(),
        enrolledPrograms: {}
      }
    );
  });
});
