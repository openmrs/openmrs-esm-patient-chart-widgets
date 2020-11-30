import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { of } from "rxjs/internal/observable/of";
import { mockPatientAllergies } from "../../../__mocks__/allergies.mock";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import AllergiesDetailedSummary from "./allergies-detailed-summary.component";
import { openWorkspaceTab } from "../shared-utils";

const mockPerformPatientAllergySearch = performPatientAllergySearch as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

const renderAllergiesDetailedSummary = () =>
  render(
    <BrowserRouter>
      <AllergiesDetailedSummary />
    </BrowserRouter>
  );

jest.mock("./allergy-intolerance.resource", () => ({
  performPatientAllergySearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("AllergiesDetailedSummary />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
    mockPerformPatientAllergySearch.mockReset;
  });

  it("should display a detailed summary of the patient's allergy history", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(of(mockPatientAllergies));

    renderAllergiesDetailedSummary();

    await screen.findByText("Allergies");
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("Allergen")).toBeInTheDocument();
    expect(screen.getByText("Severity & Reaction")).toBeInTheDocument();
    expect(screen.getByText("Since")).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();
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
      {
        allergyUuid: null,
        allergies: mockPatientAllergies,
        setAllergies: expect.anything()
      }
    );
  });

  it("renders an empty state view when allergies are absent", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(of([]));

    renderAllergiesDetailedSummary();

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
      {
        allergyUuid: null,
        allergies: mockPatientAllergies,
        setAllergies: expect.anything()
      }
    );
  });
});
