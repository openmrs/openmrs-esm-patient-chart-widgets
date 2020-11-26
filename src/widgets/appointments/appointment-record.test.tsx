import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter, match, useRouteMatch } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { mockAppointmentResponse } from "../../../__mocks__/appointments.mock";
import AppointmentRecord from "./appointment-record.component";
import AppointmentsForm from "./appointments-form.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { getAppointmentsByUuid } from "./appointments.resource";
import { openWorkspaceTab } from "../shared-utils";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockGetAppointmentsByUuid = getAppointmentsByUuid as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./appointments.resource", () => ({
  getAppointments: jest.fn(),
  getAppointmentsByUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

describe("<AppointmentRecord />", () => {
  let match: match = {
    params: {
      appointmentUuid: "68ab2e6e-7af7-4b2c-bd6f-7e2ecf30faee"
    },
    isExact: true,
    url: "/",
    path:
      "/patient/64cb4894-848a-4027-8174-05c52989c0ca/chart/appointments/details/:appointmentUuid"
  };

  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockUseRouteMatch.mockReset;
    mockGetAppointmentsByUuid.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("should display a detailed summary of the selected appointment record", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockGetAppointmentsByUuid.mockReturnValue(
      Promise.resolve(mockAppointmentResponse)
    );

    render(
      <BrowserRouter>
        <AppointmentRecord />
      </BrowserRouter>
    );

    await screen.findByText("Appointment");

    expect(screen.getByText("Appointment")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("2020-Mar-23")).toBeInTheDocument();
    expect(screen.getByText("Start time")).toBeInTheDocument();
    expect(screen.getByText("07:35 AM")).toBeInTheDocument();
    expect(screen.getByText("End time")).toBeInTheDocument();
    expect(screen.getByText("07:50 AM")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getByText("Service type")).toBeInTheDocument();
    expect(screen.getByText("Appointment type")).toBeInTheDocument();
    expect(screen.getByText("WalkIn")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Last updated")).toBeInTheDocument();
    expect(screen.getByText("Last updated by")).toBeInTheDocument();
    expect(screen.getByText("Last updated location")).toBeInTheDocument();
    expect(screen.getByText("23-Mar-2020")).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      AppointmentsForm,
      "Appointment Form"
    );
  });
});
