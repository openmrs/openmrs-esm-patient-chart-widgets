import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import HeightAndWeightOverview from "./heightandweight-overview.component";
import { BrowserRouter } from "react-router-dom";
import { getDimensions } from "./heightandweight.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { of } from "rxjs/internal/observable/of";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "../vitals/vitals-form.component";

const mockGetDimensions = getDimensions as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

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
  const mockBasePath = "/";
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
        <HeightAndWeightOverview basePath={mockBasePath} />
      </BrowserRouter>
    );

    await screen.findByText("Height & Weight");
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
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

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals Form"
    );
  });

  it("renders an empty state view when appointments data is absent", async () => {
    mockGetDimensions.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <HeightAndWeightOverview basePath={mockBasePath} />
      </BrowserRouter>
    );

    await screen.findByText("Height & Weight");
    expect(screen.getByText("Height & Weight")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(
      screen.getByText(/This patient has no dimensions recorded in the system./)
    ).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals Form"
    );
  });
});
