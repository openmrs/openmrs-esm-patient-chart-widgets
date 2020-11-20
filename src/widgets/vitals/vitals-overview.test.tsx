import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VitalsOverview from "./vitals-overview.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockVitalData } from "../../../__mocks__/vitals.mock";
import { of } from "rxjs/internal/observable/of";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { openWorkspaceTab } from "../shared-utils";
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
// TO DO Write test for carbon intergration
describe("<VitalsOverview />", () => {
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

  it("should display an overview of the patient's vitals data", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of(mockVitalData));

    render(
      <BrowserRouter>
        <VitalsOverview />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Vitals" });
    // Extra vitals loaded
    await screen.findByText("See all");
  });

  it("renders an empty state view when vitals data is absent", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <VitalsOverview />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Vitals" });
    expect(screen.getByText("Vitals")).toBeInTheDocument();
  });
});
