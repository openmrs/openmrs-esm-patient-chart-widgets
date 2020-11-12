import React from "react";

import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import {
  patient,
  mockPatientConditionsResult
} from "../../../__mocks__/conditions.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import { fetchAllConditions } from "./conditions.resource";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockFetchAllConditions = fetchAllConditions as jest.Mock;

jest.mock("./conditions.resource", () => ({
  fetchAllConditions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ConditionsDetailedSummary />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display a detailed summary of the patient's conditions", async () => {
    mockFetchAllConditions.mockReturnValue(of(mockPatientConditionsResult));

    render(
      <BrowserRouter>
        <ConditionsDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByText("Conditions");
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("Condition")).toBeInTheDocument();
    expect(screen.getByText("Onset date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Malaria, confirmed")).toBeInTheDocument();
    expect(screen.getByText("Nov-2019")).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toEqual(5);
    expect(screen.getByText("Anaemia")).toBeInTheDocument();
    expect(screen.getByText("Feb-2019")).toBeInTheDocument();
    expect(screen.getByText("Anosmia")).toBeInTheDocument();
    expect(screen.getByText("Oct-2020")).toBeInTheDocument();
    expect(
      screen.getByText(/Generalized skin infection due to AIDS/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Jun-2020")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Conditions Form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockFetchAllConditions.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <ConditionsDetailedSummary />
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
