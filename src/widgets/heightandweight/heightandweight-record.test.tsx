import React from "react";
import { match, BrowserRouter, useRouteMatch } from "react-router-dom";
import HeightAndWeightRecord from "./heightandweight-record.component";
import { getDimensions } from "./heightandweight.resource";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { openWorkspaceTab } from "../shared-utils";
import { fireEvent, render, screen } from "@testing-library/react";
import VitalsForm from "../vitals/vitals-form.component";
import { of } from "rxjs";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockGetDimensions = getDimensions as jest.Mock;

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  fhirBaseUrl: "/ws/fhir2"
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
  useRouteMatch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<HeightAndWeightRecord />", () => {
  let patient: fhir.Patient = mockPatient;
  let match: match = {
    params: { heightWeightUuid: "bb1f0b1c-99c3-4be3-ac4b-c4086523ca5c" },
    isExact: false,
    path: "/",
    url: "/"
  };

  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockUseRouteMatch.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display the height, weight, bmi correctly", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );

    await screen.findByText("Height & Weight");
    const editBtn = screen.getByRole("button", { name: "Edit" });
    expect(editBtn).toBeInTheDocument();
    expect(screen.getByText("Height & Weight")).toBeInTheDocument();
    expect(screen.getByText("Measured at")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
    expect(screen.getByText("187.43")).toBeInTheDocument();
    expect(screen.getByText("lbs")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("165")).toBeInTheDocument();
    expect(screen.getByText("cm")).toBeInTheDocument();
    expect(screen.getByText("feet")).toBeInTheDocument();
    expect(screen.getByText("inches")).toBeInTheDocument();
    expect(screen.getByText("BMI")).toBeInTheDocument();
    expect(screen.getByText("31.2")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Last updated")).toBeInTheDocument();
    expect(screen.getByText("Last updated by")).toBeInTheDocument();
    expect(screen.getByText("Last updated location")).toBeInTheDocument();

    // Clicking "Edit" launches workspace tab
    fireEvent.click(editBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      VitalsForm,
      "Edit vitals",
      { vitalUuid: "bb1f0b1c-99c3-4be3-ac4b-c4086523ca5c" }
    );
  });
});
