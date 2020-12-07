import React from "react";

import { MemoryRouter } from "react-router-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { performPatientConditionsSearch } from "./conditions.resource";
import ConditionsOverview from "./conditions-overview.component";
import { mockPatientConditionsResult } from "../../../__mocks__/conditions.mock";
import { openWorkspaceTab } from "../shared-utils";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientConditionsSearch = performPatientConditionsSearch as jest.Mock;

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    BrowserRouter: jest
      .fn()
      .mockImplementation(({ children }) => <div>{children}</div>)
  };
});

window["getOpenmrsSpaBase"] = jest.fn().mockImplementation(() => "/");

const renderConditionsOverview = () => {
  render(
    <MemoryRouter>
      <ConditionsOverview basePath="/" />
    </MemoryRouter>
  );
};

jest.mock("./conditions.resource", () => ({
  performPatientConditionsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ConditionsOverview />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
  });

  it("should display the patient conditions", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      of(mockPatientConditionsResult)
    );

    renderConditionsOverview();

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();

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
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(of([]));

    renderConditionsOverview();

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();

    expect(
      screen.getByText(/There are no conditions to display for this patient/)
    ).toBeInTheDocument();
  });
});
