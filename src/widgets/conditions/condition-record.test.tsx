import React from "react";
import { BrowserRouter, match, useRouteMatch } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { getConditionByUuid } from "./conditions.resource";
import ConditionRecord from "./condition-record.component";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import {
  patient,
  mockPatientConditionResult
} from "../../../__mocks__/conditions.mock";
import { of } from "rxjs";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockPerformPatientConditionSearch = getConditionByUuid as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./conditions.resource", () => ({
  getConditionByUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn(),
  capitalize: jest.fn().mockImplementation(s => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  })
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

describe("<ConditionRecord />", () => {
  let match: match = {
    params: {
      conditionUuid: "92A45BE7A93A4E14A49CB9A51E19C3A4"
    },
    isExact: true,
    url: "/",
    path:
      "/patient/8673ee4f-e2ab-4077-ba55-4980f408773e/chart/conditions/subview/92A45BE7A93A4E14A49CB9A51E19C3A4"
  };

  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockPerformPatientConditionSearch.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("displays a detailed summary of the selected condition", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockPerformPatientConditionSearch.mockReturnValue(
      of(mockPatientConditionResult)
    );

    render(
      <BrowserRouter>
        <ConditionRecord />
      </BrowserRouter>
    );

    await screen.findByText("Condition");
    expect(screen.getByText("Condition")).toBeInTheDocument();
    const editBtn = screen.getByRole("button", { name: "Edit" });
    expect(editBtn).toBeInTheDocument();
    expect(screen.getByText("Renal rejection")).toBeInTheDocument();
    expect(screen.getByText("Onset date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Jul-2011")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Last updated")).toBeInTheDocument();
    expect(screen.getByText("Last updated by")).toBeInTheDocument();
    expect(screen.getByText("Last updated location")).toBeInTheDocument();
    expect(screen.getByText("01-Aug-2011")).toBeInTheDocument();
    expect(screen.getByText("Dr. Katherine Mwangi")).toBeInTheDocument();
    expect(screen.getByText("Busia, Clinic")).toBeInTheDocument();

    // Clicking "Edit" launches edit form in workspace tab
    fireEvent.click(editBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ConditionsForm,
      "Edit Condition",
      {
        clinicalStatus: "active",
        conditionName: "Renal rejection",
        conditionUuid: "92A45BE7A93A4E14A49CB9A51E19C3A4",
        onsetDateTime: "2011-07-30"
      }
    );
  });
});
