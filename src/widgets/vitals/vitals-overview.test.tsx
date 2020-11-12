import React from "react";

import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { useCurrentPatient } from "@openmrs/esm-api";

import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockVitalData } from "../../../__mocks__/vitals.mock";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import VitalsOverview from "./vitals-overview.component";
import VitalsForm from "./vitals-form.component";
import { openWorkspaceTab } from "../shared-utils";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientVitalsSearch = performPatientsVitalsSearch as jest.Mock;
const mockVitalsConfig = {
  vitals: {
    bloodPressureUnit: "mmHg",
    encounterTypeUuid: "67a71486-1a54-468f-ac3e-7091a9a79584",
    formUuid: "a000cb34-9ec1-4344-a1c8-f692232f6edd",
    oxygenSaturationUnit: "%",
    pulseUnit: "bpm",
    temperatureUnit: "°C"
  }
};

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./vitals-card.resource", () => ({
  performPatientsVitalsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

jest.mock("@openmrs/esm-module-config", () => ({
  getConfig: jest.fn()
}));

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
        <VitalsOverview basePath="/" config={mockVitalsConfig} />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Vitals" });
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText(/BP \(mmHg\)/)).toBeInTheDocument();
    expect(screen.getByText(/Rate \(bpm\)/)).toBeInTheDocument();
    expect(screen.getByText(/Oxygen \(%\)/)).toBeInTheDocument();
    expect(screen.getByText(/Temp \(°C\)/)).toBeInTheDocument();
    expect(screen.getByText("2016 16-May")).toBeInTheDocument();
    expect(screen.getByText("161 / 72")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("37")).toBeInTheDocument();
    expect(screen.getByText("2015 25-Aug")).toBeInTheDocument();
    expect(screen.getByText("120 / 80")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("93")).toBeInTheDocument();
    expect(screen.getByText("38")).toBeInTheDocument();
    expect(screen.getByText("2015 20-Sep")).toBeInTheDocument();
    expect(screen.getByText("130 / 90")).toBeInTheDocument();
    expect(screen.getByText("65")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();

    // Clicking "Add" launches the vitals form in a new workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals form"
    );
  });

  it("renders an empty state view when vitals data is absent", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <VitalsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Vitals" });
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    expect(
      screen.getByText(/There are no vital signs to display for this patient/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Record vital signs/)).toBeInTheDocument();
  });
});
