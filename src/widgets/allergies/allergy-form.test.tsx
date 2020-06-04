import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { match, BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  mockPatientAllergy,
  mockAllergicReactions,
  mockEnvironmentalAllergens
} from "../../../__mocks__/allergy.mock";
import {
  getAllergyReaction,
  getPatientAllergyByPatientUuid,
  getAllergyAllergenByConceptUuid
} from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockGetPatientAllergyByPatientUuid = getPatientAllergyByPatientUuid as jest.Mock;
const mockGetAllergicReaction = getAllergyReaction as jest.Mock;
const mockGetAllergyAllergenByConceptUuid = getAllergyAllergenByConceptUuid as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  getAllergyReaction: jest.fn(),
  getAllergyAllergenByConceptUuid: jest.fn(),
  getPatientAllergyByPatientUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

describe("<AllergyForm />", () => {
  let match: match = { params: {}, isExact: false, path: "/", url: "/" };
  let patient: fhir.Patient;

  beforeEach(() => {
    patient = mockPatient;
    mockUseCurrentPatient.mockReset;
    mockGetPatientAllergyByPatientUuid.mockReset;
    mockGetAllergicReaction.mockReset;
    mockGetAllergyAllergenByConceptUuid.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockGetAllergicReaction.mockReturnValue(
      of(mockAllergicReactions.setMembers)
    );
    mockGetAllergyAllergenByConceptUuid.mockReturnValue(
      of(mockEnvironmentalAllergens)
    );
  });

  it("renders the create allergy form with the appropriate fields and values", async () => {
    mockGetPatientAllergyByPatientUuid.mockResolvedValue(mockPatientAllergy);

    render(
      <BrowserRouter>
        <AllergyForm match={match} />
      </BrowserRouter>
    );

    await screen.findByText("Add Allergy");

    expect(screen.getByText("Add Allergy")).toBeInTheDocument();
    expect(screen.getByText("Category of reaction")).toBeInTheDocument();
    expect(screen.getByLabelText("Drug")).toBeInTheDocument();
    expect(screen.getByLabelText("Environmental")).toBeInTheDocument();
    expect(screen.getByLabelText("Food")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Patient has no allergies")
    ).toBeInTheDocument();

    const environmentalAllergenCheckbox = screen.getByLabelText(
      "Environmental"
    );
    expect(environmentalAllergenCheckbox).not.toBeChecked();
    fireEvent.click(environmentalAllergenCheckbox);
    expect(environmentalAllergenCheckbox).toBeChecked();

    expect(screen.getByText(/Environment allergen/)).toBeInTheDocument();
    expect(screen.getByText("Bee stings")).toBeInTheDocument();
    expect(screen.getByText("Dust")).toBeInTheDocument();
    expect(screen.getByText("Latex")).toBeInTheDocument();
    expect(screen.getByText("Reactions")).toBeInTheDocument();
    expect(screen.getByText("Select all that apply")).toBeInTheDocument();
    expect(screen.getByText("Mental status change")).toBeInTheDocument();
    expect(screen.getByText("Anaemia")).toBeInTheDocument();
    expect(screen.getByText("Anaphylaxis")).toBeInTheDocument();
    expect(screen.getByText("Severity of worst reaction")).toBeInTheDocument();
    expect(screen.getByText("Mild")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("Severe")).toBeInTheDocument();
    expect(screen.getByText("Date of first onset")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).not.toBeDisabled();
    const submitBtn = screen.getByRole("button", { name: "Sign & Save" });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
});
