import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { of } from "rxjs/internal/observable/of";

import { mockVitalData } from "../../../__mocks__/vitals.mock";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "./vitals-form.component";
import VitalsDetailedSummary from "./vitals-detailed-summary.component";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientVitalsSearch = performPatientsVitalsSearch as jest.Mock;

const renderVitalsDetailedSummary = () =>
  render(
    <BrowserRouter>
      <VitalsDetailedSummary />
    </BrowserRouter>
  );

jest.mock("./vitals-card.resource", () => ({
  performPatientsVitalsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<VitalsDetailedSummary />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
    mockPerformPatientVitalsSearch.mockReset;
  });

  it("renders a detailed summary of the patient's vitals", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of(mockVitalData));

    renderVitalsDetailedSummary();

    await screen.findByRole("heading", { name: "Vitals" });
    expect(screen.getByText("Vitals")).toBeInTheDocument();

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
  });

  it("renders an empty state view when vitals data is absent", async () => {
    mockPerformPatientVitalsSearch.mockReturnValue(of([]));

    renderVitalsDetailedSummary();

    await screen.findByText("Vitals");
    expect(screen.getByText("Vitals")).toBeInTheDocument();

    expect(
      screen.getByText(/There are no vitals to display for this patient/)
    ).toBeInTheDocument();
  });
});
