import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import ImmunizationsOverview from "./immunizations-overview.component";

import { mockPatientImmunizationsSearchResponse } from "../../../__mocks__/immunizations.mock";

const mockPerformPatientImmunizationsSearch = performPatientImmunizationsSearch as jest.Mock;

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

const renderImmunizationsOverview = () => {
  render(
    <MemoryRouter>
      <ImmunizationsOverview basePath="/" />
    </MemoryRouter>
  );
};

jest.mock("./immunizations.resource", () => ({
  performPatientImmunizationsSearch: jest.fn()
}));

const match = { params: {}, isExact: false, path: "/", url: "/" };

describe("<ImmunizationsOverview />", () => {
  it("should display the patient immunizations along with recent vaccination date ", async () => {
    mockPerformPatientImmunizationsSearch.mockReturnValue(
      Promise.resolve(mockPatientImmunizationsSearchResponse)
    );

    renderImmunizationsOverview();

    await screen.findByText("Rotavirus");

    expect(screen.getByText("Rotavirus")).toBeTruthy();
    expect(screen.getByText("Sep-2018")).toBeTruthy();
    expect(screen.getByText("Polio")).toBeTruthy();
    expect(screen.getByText("Nov-2018")).toBeTruthy();
    expect(screen.getByText("Influenza")).toBeTruthy();
    expect(screen.getByText("May-2018")).toBeTruthy();
  });
});
