import React from "react";

import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { mockPatientConditionsResult } from "../../../__mocks__/conditions.mock";

import ConditionsDetailedSummary from "./conditions-detailed-summary.component";
import { performPatientConditionsSearch } from "./conditions.resource";
import { openWorkspaceTab } from "../shared-utils";
import dayjs from "dayjs";

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

const renderDateDisplay = (time: string) => dayjs(time).format("MMM-YYYY");

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

    expect(screen.getByText("Condition")).toBeInTheDocument();
    expect(screen.getByText("Onset date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Malaria, confirmed")).toBeInTheDocument();
    expect(
      screen.getByText(
        renderDateDisplay(mockPatientConditionsResult[0].onsetDateTime)
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toEqual(5);
    expect(screen.getByText("Anaemia")).toBeInTheDocument();
    expect(
      screen.getByText(
        renderDateDisplay(mockPatientConditionsResult[1].onsetDateTime)
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Anosmia")).toBeInTheDocument();
    expect(
      screen.getByText(
        renderDateDisplay(mockPatientConditionsResult[2].onsetDateTime)
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Generalized skin infection due to AIDS/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        renderDateDisplay(mockPatientConditionsResult[3].onsetDateTime)
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(of([]));

    renderConditionsDetailedSummary();

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();
    expect(
      screen.getByText(/There are no conditions to display for this patient/)
    ).toBeInTheDocument();
  });
});
