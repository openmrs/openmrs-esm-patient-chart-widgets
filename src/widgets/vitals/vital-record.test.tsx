import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, match, useRouteMatch } from "react-router-dom";
import VitalRecord from "./vital-record.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { mockVitalData } from "../../../__mocks__/vitals.mock";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { of } from "rxjs/internal/observable/of";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "./vitals-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockFetchPatientVitalSigns = performPatientsVitalsSearch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./vitals-card.resource", () => ({
  performPatientsVitalsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

describe("<VitalRecord />", () => {
  let match: match = {
    params: { vitalUuid: "d821eb55-1ba8-49c3-9ac8-95882744bd27" },
    isExact: false,
    path: "/",
    url: "/"
  };

  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockFetchPatientVitalSigns.mockReset;
    mockUseRouteMatch.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("renders a summary of the selected vital observations", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockFetchPatientVitalSigns.mockReturnValue(of(mockVitalData));

    render(
      <BrowserRouter>
        <VitalRecord />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Vital" });
    expect(screen.getByText("Vital")).toBeInTheDocument();
    const editBtn = screen.getByRole("button", { name: "Edit" });
    expect(editBtn).toBeInTheDocument();
    expect(screen.getByText("Measured at")).toBeInTheDocument();
    expect(screen.getByText(/2[45]-Aug-2015/)).toBeInTheDocument(); // allow for time zones
    expect(screen.getByText("Blood pressure")).toBeInTheDocument();
    expect(screen.getByText("120 / 80")).toBeInTheDocument();
    expect(screen.getByText("mmHg")).toBeInTheDocument();
    expect(screen.getByText("Heart rate")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("bpm")).toBeInTheDocument();
    expect(screen.getByText("Oxygen saturation")).toBeInTheDocument();
    expect(screen.getByText("93")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("38")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();

    // Clicking "Edit" launches edit form in workspace tab
    fireEvent.click(editBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Edit vitals",
      { vitalUuid: "d821eb55-1ba8-49c3-9ac8-95882744bd27" }
    );
  });
});
