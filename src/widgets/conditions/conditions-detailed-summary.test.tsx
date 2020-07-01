import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import { performPatientConditionsSearch } from "./conditions.resource";
import {
  patient,
  mockPatientConditionsResult
} from "../../../__mocks__/conditions.mock";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockPerformPatientConditionsSearch = performPatientConditionsSearch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./conditions.resource", () => ({
  performPatientConditionsSearch: jest.fn()
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
    mockPerformPatientConditionsSearch.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display a detailed summary of the patient's conditions", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      Promise.resolve(mockPatientConditionsResult)
    );

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
    expect(screen.getByText("Hypertension")).toBeInTheDocument();
    expect(screen.getByText("Aug-2011")).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toEqual(3);
    expect(screen.getByText("Fever")).toBeInTheDocument();
    expect(screen.getByText("Jun-2015")).toBeInTheDocument();
    expect(screen.getByText("Renal rejection")).toBeInTheDocument();
    expect(screen.getByText("Jul-2011")).toBeInTheDocument();
    expect(screen.getByText("Shortness of breath")).toBeInTheDocument();
    expect(screen.getByText("Oct-2011")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Overweight")).toBeInTheDocument();
    expect(screen.getByText("Oct-2012")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Conditions Form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      Promise.resolve({ data: { total: 0 } })
    );

    render(
      <BrowserRouter>
        <ConditionsDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(
      screen.getByText(/This patient has no conditions recorded in the system./)
    ).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Conditions Form"
    );
  });
});
