import React from "react";

import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { render, screen, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { fetchActiveConditions } from "./conditions.resource";
import ConditionsOverview from "./conditions-overview.component";
import {
  patient,
  mockPatientConditionsResult
} from "../../../__mocks__/conditions.mock";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockFetchActiveConditions = fetchActiveConditions as jest.Mock;

jest.mock("./conditions.resource", () => ({
  fetchActiveConditions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ConditionsOverview />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display the patient's active conditions", async () => {
    mockFetchActiveConditions.mockReturnValue(of(mockPatientConditionsResult));

    render(
      <BrowserRouter>
        <ConditionsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("Active Conditions")).toBeInTheDocument();
    expect(screen.getByText("Since")).toBeInTheDocument();
    expect(screen.getByText("Malaria, confirmed")).toBeInTheDocument();
    expect(screen.getByText("Nov-2019")).toBeInTheDocument();
    expect(screen.getByText("Anaemia")).toBeInTheDocument();
    expect(screen.getByText("Feb-2019")).toBeInTheDocument();
    expect(screen.getByText("Anosmia")).toBeInTheDocument();
    expect(screen.getByText("Oct-2020")).toBeInTheDocument();
    expect(
      screen.getByText(/Generalized skin infection due to AIDS/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Jun-2020")).toBeInTheDocument();

    // Clicking "Add" launches the conditions form in a new workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Conditions Form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockFetchActiveConditions.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <ConditionsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Conditions" });

    expect(screen.getByText(/Conditions/)).toBeInTheDocument();
    expect(
      screen.getByText(/There are no conditions to display for this patient/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Record conditions/)).toBeInTheDocument();
  });
});
