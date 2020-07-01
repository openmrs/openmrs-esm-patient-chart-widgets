import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VitalsDetailedSummary from "./vitals-detailed-summary.component";
import { mockVitalData } from "../../../__mocks__/vitals.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { useCurrentPatient, openmrsObservableFetch } from "@openmrs/esm-api";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { openWorkspaceTab } from "../shared-utils";
import { of } from "rxjs";
import VitalsForm from "./vitals-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientVitalsSearch = performPatientsVitalsSearch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./vitals-card.resource", () => ({
  performPatientsVitalsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<VitalsDetailedSummary />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockPerformPatientVitalsSearch.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("renders a detailed summary of the patient's vitals", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of(mockVitalData));

    render(
      <BrowserRouter>
        <VitalsDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Vitals" });
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("BP")).toBeInTheDocument();
    expect(screen.getByText("Rate")).toBeInTheDocument();
    expect(screen.getByText("Oxygen")).toBeInTheDocument();
    expect(screen.getByText("Temp")).toBeInTheDocument();
    expect(screen.getByText("2016 16-May")).toBeInTheDocument();
    expect(screen.getByText("161 / 72")).toBeInTheDocument();
    expect(screen.getByText("mmHg")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("bpm")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(nextButton);
    await screen.findByText("Page 2 of 3");

    fireEvent.click(nextButton);
    await screen.findByText("Page 3 of 3");

    const previousButton = screen.getByRole("button", { name: "Previous" });
    expect(previousButton).toBeInTheDocument();

    fireEvent.click(previousButton);
    await screen.findByText("Page 2 of 3");

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals Form"
    );
  });

  it("renders an empty state view when vitals data is absent", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <VitalsDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByText("Vitals");
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(
      screen.getByText(/This patient has no vitals recorded in the system./)
    ).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals Form"
    );
  });
});
