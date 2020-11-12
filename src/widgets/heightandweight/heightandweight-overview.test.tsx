import React from "react";

import { of } from "rxjs/internal/observable/of";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { useCurrentPatient } from "@openmrs/esm-api";

import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import HeightAndWeightOverview from "./heightandweight-overview.component";
import { getDimensions } from "./heightandweight.resource";
import VitalsForm from "../vitals/vitals-form.component";
import { openWorkspaceTab } from "../shared-utils";

const mockGetDimensions = getDimensions as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockDimensionsConfig = {
  concepts: {
    diastolicBloodPressureUuid: "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    heightUuid: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    oxygenSaturationUuid: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    pulseUuid: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    systolicBloodPressureUuid: "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    temperatureUuid: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    weightUuid: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  },
  heightAndWeightConfig: {
    bmiUnit: "kg / m²",
    heightUnit: "cm",
    weightUnit: "kg"
  }
};

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<HeightAndWeightOverview />", () => {
  beforeEach(() => {
    mockGetDimensions.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("renders an overview of the patient's dimensions data if present", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    render(
      <BrowserRouter>
        <HeightAndWeightOverview basePath="/" config={mockDimensionsConfig} />
      </BrowserRouter>
    );

    await screen.findByText("Height & weight");
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText(/Weight \(kg\)/)).toBeInTheDocument();
    expect(screen.getByText(/Height \(cm\)/)).toBeInTheDocument();
    expect(screen.getByText(/BMI \(kg \/ m²\)/)).toBeInTheDocument();
    expect(screen.getByText("15-Apr 02:11 PM")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getAllByText("165").length).toBe(2);
    expect(screen.getByText("31.2")).toBeInTheDocument();
    expect(screen.getByText("13-Apr 03:09 PM")).toBeInTheDocument();
    expect(screen.getByText("29.4")).toBeInTheDocument();
    expect(screen.getByText("09-Apr 11:47 AM")).toBeInTheDocument();
    expect(screen.getByText("186")).toBeInTheDocument();
    expect(screen.getByText("See all")).toBeInTheDocument();

    // Clicking "Add" launches the height and weight workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals Form"
    );
  });

  it("renders an empty state view when dimensions data is absent", async () => {
    mockGetDimensions.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <HeightAndWeightOverview basePath="/" config={mockDimensionsConfig} />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Height & weight" });

    expect(screen.getByText("Height & weight")).toBeInTheDocument();
    expect(
      screen.getByText(/There are no dimensions to display for this patient/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Record dimensions/));
  });
});
