import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import HeightAndWeightSummary from "./heightandweight-summary.component";
import { getDimensions } from "./heightandweight.resource";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";

import { openWorkspaceTab } from "../shared-utils";
import { of } from "rxjs/internal/observable/of";

const mockGetDimensions = getDimensions as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

const renderHeightAndWeightSummary = () => {
  render(
    <BrowserRouter>
      <HeightAndWeightSummary />
    </BrowserRouter>
  );
};

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<HeightAndWeightSummary />", () => {
  beforeEach(() => {
    mockGetDimensions.mockReset;
    mockOpenWorkspaceTab.mockReset;
  });

  it("renders a detailed summary of the patient's dimensions data if present", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    renderHeightAndWeightSummary();

    await screen.findByText(/Height & Weight/i);

    expect(screen.getByText("Weight (kg)")).toBeInTheDocument();
    expect(screen.getByText("Height (cm)")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "BMI (kg/m 2 )" })
    ).toBeInTheDocument();
    expect(screen.getByText("15-Apr")).toBeInTheDocument();
    expect(screen.getByText("02:11 PM")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getAllByText("165").length).toBe(2);
    expect(screen.getByText("31.2")).toBeInTheDocument();
    expect(screen.getByText("13-Apr")).toBeInTheDocument();
    expect(screen.getByText("03:09 PM")).toBeInTheDocument();
    expect(screen.getByText("02-Apr")).toBeInTheDocument();
    expect(screen.getByText("02:00 AM")).toBeInTheDocument();
    expect(screen.getByText("30-Mar")).toBeInTheDocument();
    expect(screen.getByText("03:38 PM")).toBeInTheDocument();
    expect(screen.getByText("70")).toBeInTheDocument();
    expect(screen.getByText("185")).toBeInTheDocument();
    expect(screen.getByText("20.5")).toBeInTheDocument();
  });

  it("renders an empty state view when dimensions data is absent", async () => {
    mockGetDimensions.mockReturnValue(of([]));

    renderHeightAndWeightSummary();

    await screen.findByText(/Height & Weight/i);
    expect(screen.getByText(/Height & Weight/i)).toBeInTheDocument();

    expect(
      screen.getByText(/There are no dimensions to display for this patient/)
    ).toBeInTheDocument();
  });
});
