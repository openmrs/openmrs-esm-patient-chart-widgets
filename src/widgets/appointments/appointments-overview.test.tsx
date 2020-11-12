import React from "react";

import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockAppointmentsResponse } from "../../../__mocks__/appointments.mock";
import { getAppointments } from "./appointments.resource";
import AppointmentsOverview from "./appointments-overview.component";
import AppointmentsForm from "./appointments-form.component";
import { openWorkspaceTab } from "../shared-utils";

const mockGetAppointments = getAppointments as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPatientAppointments = getAppointments as jest.Mock;

jest.mock("./appointments.resource", () => ({
  getAppointments: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<AppointmentsOverview />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockPatientAppointments.mockReset;
    mockGetAppointments.mockReset;
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("should display an overview of the patient's appointments when present", async () => {
    mockGetAppointments.mockReturnValue(
      Promise.resolve(mockAppointmentsResponse)
    );

    render(
      <BrowserRouter>
        <AppointmentsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByText("Appointments");
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Service Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("08-Mar-2020")).toBeInTheDocument();
    expect(screen.getByText("Outpatient")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("15-Mar-2020")).toBeInTheDocument();
    expect(screen.getByText("Inpatient")).toBeInTheDocument();
    expect(screen.getByText("Unscheduled")).toBeInTheDocument();

    // Clicking "Add" launches the appointments form in a new workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      AppointmentsForm,
      "Appointments Form"
    );
  });

  it("renders an empty state view when appointments data is absent", async () => {
    mockGetAppointments.mockReturnValue(Promise.resolve({ data: [] }));

    render(
      <BrowserRouter>
        <AppointmentsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Appointments" });

    expect(screen.getByText(/Appointments/)).toBeInTheDocument();
    expect(
      screen.getByText(/There are no appointments to display for this patient/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Record appointments/));
  });
});
