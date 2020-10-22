import React from "react";
import { useHistory, useRouteMatch, BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useCurrentPatient } from "@openmrs/esm-api";
import { patient } from "../../../__mocks__/conditions.mock";
import { ConditionsForm } from "./conditions-form.component";
import {
  createPatientCondition,
  updatePatientCondition
} from "./conditions.resource";

const mockUseHistory = useHistory as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockcreatePatientCondition = createPatientCondition as jest.Mock;
const mockUpdatePatientCondition = updatePatientCondition as jest.Mock;

jest.mock("./conditions.resource", () => ({
  createPatientCondition: jest.fn(),
  updatePatientCondition: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
  useRouteMatch: jest.fn()
}));

describe("<ConditionsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };

  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockUseHistory.mockReset;
    mockUseRouteMatch.mockReset;
    mockcreatePatientCondition.mockReset;
    mockUpdatePatientCondition.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  afterEach(() => jest.restoreAllMocks());

  it("renders the conditions form with all the relevant fields and values", async () => {
    mockcreatePatientCondition.mockReturnValue(
      Promise.resolve({ status: 201, body: "Condition created" })
    );
    mockUseHistory.mockReturnValue({
      push: jest.fn()
    });

    render(
      <BrowserRouter>
        <ConditionsForm match={match} />
      </BrowserRouter>
    );

    await screen.findByText("Add a new condition");
    expect(screen.getByLabelText("Condition")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of onset")).toBeInTheDocument();
    expect(screen.getByText("Current status")).toBeInTheDocument();
    expect(screen.getByLabelText("Active")).toBeInTheDocument();
    expect(screen.getByLabelText("Inactive")).toBeInTheDocument();
    expect(screen.getByLabelText("History of")).toBeInTheDocument();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    const submitBtn = screen.getByRole("button", { name: "Sign & Save" });
    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(cancelBtn).not.toBeDisabled();
    expect(submitBtn).toBeDisabled();

    const conditionInput = screen.getByRole("textbox", { name: "Condition" });
    fireEvent.change(conditionInput, { target: { value: "Myalgia" } });
    await screen.findByDisplayValue("Myalgia");

    const onsetDateInput = screen.getByLabelText("Date of onset");
    fireEvent.change(onsetDateInput, { target: { value: "2020-05-05" } });
    await screen.findByDisplayValue("2020-05-05");

    const activeStatusInput = screen.getByRole("radio", { name: "Active" });
    expect(activeStatusInput).not.toBeChecked();
    fireEvent.click(activeStatusInput);
    await screen.findByRole("radio", { name: "Active" });
    expect(activeStatusInput).toBeChecked();

    fireEvent.click(submitBtn);

    expect(mockcreatePatientCondition).toHaveBeenCalledTimes(1);
    expect(mockcreatePatientCondition).toHaveBeenCalledWith(
      {
        clinicalStatus: "active",
        conditionName: "Myalgia",
        onsetDateTime: "2020-05-05"
      },
      patient.id,
      new AbortController()
    );

    expect(mockUseHistory).toHaveBeenCalled();

    // clicking Cancel prompts user for confirmation
    window.confirm = jest.fn(() => true);

    fireEvent.click(cancelBtn);

    jest.spyOn(window, "confirm").mockImplementation(() => true);

    expect(window.confirm).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      "There is ongoing work, are you sure you want to close this tab?"
    );
  });

  it("renders the edit condition form when the edit button is clicked", async () => {
    match.params = {
      conditionUuid: "26EFFA98F55D48B38687B3920285BE15",
      conditionName: "Hypertension",
      clinicalStatus: "active",
      onsetDateTime: "2015-06-22"
    };
    mockUseRouteMatch.mockReturnValue(match);
    mockUpdatePatientCondition.mockReturnValue(
      Promise.resolve({ status: 200, body: "ok" })
    );

    render(
      <BrowserRouter>
        <ConditionsForm match={match} />
      </BrowserRouter>
    );

    await screen.findByText("Edit Condition");
    expect(screen.getByText("Condition")).toBeInTheDocument();
    expect(screen.getByText("Hypertension")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of onset")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2015-06-22")).toBeInTheDocument();
    expect(screen.getByText("Current status")).toBeInTheDocument();

    const activeStatusInput = screen.getByRole("radio", { name: "Active" });
    const inactiveStatusInput = screen.getByRole("radio", { name: "Inactive" });
    const historyOfStatusInput = screen.getByRole("radio", {
      name: "History of"
    });

    expect(activeStatusInput).toBeInTheDocument();
    expect(inactiveStatusInput).toBeInTheDocument();
    expect(historyOfStatusInput).toBeInTheDocument();
    expect(activeStatusInput).toBeChecked();
    expect(inactiveStatusInput).not.toBeChecked();
    expect(historyOfStatusInput).not.toBeChecked();

    const cancelBtn = screen.getByRole("button", { name: "Cancel changes" });
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    const submitBtn = screen.getByRole("button", { name: "Sign & Save" });

    expect(cancelBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    expect(submitBtn).toBeDisabled();
    expect(cancelBtn).not.toBeDisabled();
    expect(deleteBtn).not.toBeDisabled();

    fireEvent.click(inactiveStatusInput);
    await screen.findByLabelText("Date of inactivity");
    expect(inactiveStatusInput).toBeChecked();

    fireEvent.change(screen.getByLabelText("Date of inactivity"), {
      target: { value: "2020-04-05" }
    });

    await screen.getByDisplayValue("2020-04-05");

    fireEvent.click(submitBtn);

    expect(mockUpdatePatientCondition).toHaveBeenCalledTimes(1);
    expect(mockUpdatePatientCondition).toHaveBeenCalledWith(
      {
        clinicalStatus: "inactive",
        conditionName: "Hypertension",
        conditionUuid: "26EFFA98F55D48B38687B3920285BE15",
        onsetDateTime: "2015-06-22",
        inactivityDate: "2020-04-05"
      },
      patient.id,
      new AbortController()
    );

    expect(mockUseHistory).toHaveBeenCalled();

    // clicking Cancel prompts user for confirmation
    window.confirm = jest.fn(() => true);

    fireEvent.click(cancelBtn);

    jest.spyOn(window, "confirm").mockImplementation(() => true);

    expect(window.confirm).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      "There is ongoing work, are you sure you want to close this tab?"
    );
  });
});
