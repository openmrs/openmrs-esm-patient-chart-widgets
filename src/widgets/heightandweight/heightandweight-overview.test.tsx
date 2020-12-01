import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { of } from "rxjs/internal/observable/of";

import { getDimensions } from "./heightandweight.resource";
import HeightAndWeightOverview from "./heightandweight-overview.component";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "../vitals/vitals-form.component";

const mockGetDimensions = getDimensions as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

const renderHeightAndWeightOverview = () => {
  render(
    <BrowserRouter>
      <HeightAndWeightOverview basePath="/" />
    </BrowserRouter>
  );
};

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<HeightAndWeightOverview />", () => {
  beforeEach(() => {
    mockGetDimensions.mockReset;
    mockOpenWorkspaceTab.mockReset;
  });

  it("renders an overview of the patient's dimensions data if present", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    renderHeightAndWeightOverview();

    await screen.findByText(/Height & Weight/i);

    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("BMI")).toBeInTheDocument();
    expect(screen.getByText("15-Apr 02:11 PM")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
    expect(screen.getAllByText("165").length).toBe(2);
    expect(screen.getByText("cm")).toBeInTheDocument();
    expect(screen.getByText("31.2")).toBeInTheDocument();
    expect(screen.getByText("13-Apr 03:09 PM")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("29.4")).toBeInTheDocument();
    expect(screen.getByText("09-Apr 11:47 AM")).toBeInTheDocument();
    expect(screen.getByText("186")).toBeInTheDocument();
    expect(screen.getByText("See all")).toBeInTheDocument();
  });

  it("renders an empty state view when appointments data is absent", async () => {
    mockGetDimensions.mockReturnValue(of([]));

    renderHeightAndWeightOverview();

    await screen.findByText(/Height & Weight/i);
    expect(screen.getByText(/Height & Weight/i)).toBeInTheDocument();
    expect(
      screen.getByText(/There are no dimensions to display for this patient/)
    ).toBeInTheDocument();
  });
});
