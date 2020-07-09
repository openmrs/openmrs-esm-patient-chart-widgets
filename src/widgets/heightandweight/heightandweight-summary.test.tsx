import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import HeightAndWeightSummary from "./heightandweight-summary.component";
import { getDimensions } from "./heightandweight.resource";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { useCurrentPatient } from "@openmrs/esm-api";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "../vitals/vitals-form.component";
import { of } from "rxjs";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockGetDimensions = getDimensions as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  fhirBaseUrl: "/ws/fhir2"
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<HeightAndWeightSummary />", () => {
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

  it("renders a detailed summary of the patient's dimensions data if present", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    render(
      <BrowserRouter>
        <HeightAndWeightSummary />
      </BrowserRouter>
    );

    await screen.findByText("Height & Weight");
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
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

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Vitals Form"
    );
  });
});

it("renders an empty state view when dimensions data is absent", async () => {
  mockGetDimensions.mockReturnValue(of([]));

  render(
    <BrowserRouter>
      <HeightAndWeightSummary />
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
  expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(VitalsForm, "Vitals Form");
});
