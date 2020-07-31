import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { of } from "rxjs/internal/observable/of";
import {
  patient,
  mockPatientAllergies
} from "../../../__mocks__/allergies.mock";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import AllergiesDetailedSummary from "./allergies-detailed-summary.component";
import { openWorkspaceTab } from "../shared-utils";

const mockPerformPatientAllergySearch = performPatientAllergySearch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  performPatientAllergySearch: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("AllergiesDetailedSummary />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockPerformPatientAllergySearch.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display a detailed summary of the patient's allergy history", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(of(mockPatientAllergies));

    render(
      <BrowserRouter>
        <AllergiesDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByText("Allergies");
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("ALLERGEN")).toBeInTheDocument();
    expect(screen.getByText("SEVERITY & REACTION")).toBeInTheDocument();
    expect(screen.getByText("SINCE")).toBeInTheDocument();
    expect(screen.getByText("UPDATED")).toBeInTheDocument();
    expect(screen.getByText("Cephalosporins")).toBeInTheDocument();
    expect(screen.getByText("Angioedema")).toBeInTheDocument();
    expect(screen.getByText("happened today")).toBeInTheDocument();
    expect(screen.getByText("Peanuts")).toBeInTheDocument();
    expect(screen.getByText("Anaphylaxis")).toBeInTheDocument();
    expect(screen.getByText("ACE inhibitors")).toBeInTheDocument();
    expect(screen.getAllByText("high").length).toEqual(2);
    expect(screen.getAllByText("Severe reaction").length).toEqual(2);

    // Clicking "Add" launches workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      AllergyForm,
      "Allergies Form",
      { allergyUuid: null }
    );
  });

  it("renders an empty state view when allergies are absent", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <AllergiesDetailedSummary />
      </BrowserRouter>
    );

    await screen.findByText("Allergies");

    expect(screen.getByText("Allergies")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "This patient has no allergy intolerances recorded in the system."
      )
    ).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      AllergyForm,
      "Allergies Form",
      { allergyUuid: null }
    );
  });
});
