import React from "react";

import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { useCurrentPatient } from "@openmrs/esm-api";

import { openWorkspaceTab } from "../shared-utils";
import {
  patient,
  mockPatientImmunizationsSearchResponse
} from "../../../__mocks__/immunizations.mock";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import ImmunizationsOverview from "./immunizations-overview.component";
import { ImmunizationsForm } from "./immunizations-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.MockedFunction<any>;
const mockPerformPatientImmunizationsSearch = performPatientImmunizationsSearch as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./immunizations.resource", () => ({
  performPatientImmunizationsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ImmunizationsOverview />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display the patients immunizations along with recent vaccination dates", async () => {
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsSearchResponse)
    );

    render(
      <BrowserRouter>
        <ImmunizationsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Immunizations" });

    expect(screen.getByText("Immunizations")).toBeInTheDocument();
    expect(screen.getByText("Vaccine")).toBeInTheDocument();
    expect(screen.getByText("Recent vaccination")).toBeInTheDocument();
    expect(screen.getByText("Rotavirus")).toBeInTheDocument();
    expect(screen.getByText("Polio")).toBeInTheDocument();
    expect(screen.getByText("Influenza")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See all" })).toBeInTheDocument();

    // Clicking "Add" launches the immunizations form in a new workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ImmunizationsForm,
      "Immunizations form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockPerformPatientImmunizationsSearch.mockReturnValue(Promise.resolve([]));

    render(
      <BrowserRouter>
        <ImmunizationsOverview basePath="/" />
      </BrowserRouter>
    );
    await screen.findByRole("heading", { name: "Immunizations" });

    expect(screen.getByText(/Immunizations/)).toBeInTheDocument();
    expect(
      screen.getByText(/There are no immunizations to display for this patient/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Record immunizations/)).toBeInTheDocument();
  });
});
