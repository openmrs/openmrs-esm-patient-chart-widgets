import React from "react";

import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { render, screen, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { performPatientConditionsSearch } from "./conditions.resource";
import ConditionsOverview from "./conditions-overview.component";
import {
  patient,
  mockPatientConditionsResult
} from "../../../__mocks__/conditions.mock";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientConditionsSearch = performPatientConditionsSearch as jest.Mock;

jest.mock("./conditions.resource", () => ({
  performPatientConditionsSearch: jest.fn()
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

  it("should display the patient conditions", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      of(mockPatientConditionsResult)
    );

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
    expect(screen.getByText("More")).toBeInTheDocument();

    const moreBtn = screen.getByRole("button", { name: "More" });
    expect(moreBtn).toBeInTheDocument();

    // Clicking more loads more allergies
    fireEvent.click(moreBtn);
    expect(screen.getByText("Rash")).toBeInTheDocument();
    expect(screen.getByText("Cough")).toBeInTheDocument();
    expect(screen.getByText("See all")).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Conditions Form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <ConditionsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(
      screen.getByText(/This patient has no conditions recorded in the system./)
    ).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Conditions Form"
    );
  });
});
