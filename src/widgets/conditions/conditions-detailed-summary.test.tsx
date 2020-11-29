import React from "react";

import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { mockPatientConditionsResult } from "../../../__mocks__/conditions.mock";

import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import { performPatientConditionsSearch } from "./conditions.resource";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientConditionsSearch = performPatientConditionsSearch as jest.Mock;

const renderConditionsDetailedSummary = () => {
  render(
    <BrowserRouter>
      <ConditionsDetailedSummary />
    </BrowserRouter>
  );
};

jest.mock("./conditions.resource", () => ({
  performPatientConditionsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ConditionsDetailedSummary />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
  });

  it("should display a detailed summary of the patient's conditions", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      of(mockPatientConditionsResult)
    );

    renderConditionsDetailedSummary();

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
    mockPerformPatientConditionsSearch.mockReturnValue(of([]));

    renderConditionsDetailedSummary();

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
