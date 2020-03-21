import React from "react";
import {
  render,
  cleanup,
  RenderResult,
  wait,
  fireEvent
} from "@testing-library/react";
import { BrowserRouter, match } from "react-router-dom";
import { useRouteMatch } from "react-router";
import AppointmentRecord from "./appointment-record.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  mockAppointmentsResponse,
  mockAppointmentResponse
} from "../../../__mocks__/appointment.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import * as appointmentResource from "./appointments.resource";
import { act } from "react-dom/test-utils";
import {
  getAppointments,
  getAppointmentsByUuid
} from "./appointments.resource";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockgetAppointments = getAppointments as jest.Mock;
const mockGetAppointmentsByUuid = getAppointmentsByUuid as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  newWorkspaceItem: jest.fn()
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useRouteMatch: jest.fn()
}));

jest.mock("./appointments.resource", () => ({
  getAppointments: jest.fn(),
  getAppointmentsByUuid: jest.fn(),
  openAppointmentWorkspaceItem: jest.fn().mockImplementation(() => jest.fn())
}));

describe("<AppointementRecord/>", () => {
  let match: match;
  let wrapper: RenderResult;
  let patient: fhir.Patient = mockPatient;

  beforeEach(() => {
    match = {
      params: {
        appointmentUuid: "68ab2e6e-7af7-4b2c-bd6f-7e2ecf30faee"
      },
      isExact: true,
      url: "/",
      path:
        "/patient/64cb4894-848a-4027-8174-05c52989c0ca/chart/appointments/details/:appointmentUuid"
    };
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("should render without dying", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockUseRouteMatch.mockReturnValue(match);
    mockGetAppointmentsByUuid.mockReturnValue(
      Promise.resolve(mockAppointmentResponse)
    );

    await wait(() => {
      wrapper = render(
        <BrowserRouter>
          <AppointmentRecord />
        </BrowserRouter>
      );
    });
  });

  it("should display patient appointment correctly", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockGetAppointmentsByUuid.mockReturnValue(
      Promise.resolve(mockAppointmentResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <AppointmentRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByText("Appointment")).toBeTruthy();
      expect(wrapper.getByText("2020-Mar-23")).toBeTruthy();
      expect(wrapper.getByText("N/A")).toBeTruthy();
      expect(wrapper.getByText("WalkIn")).toBeTruthy();
      expect(wrapper.getByText("Scheduled")).toBeTruthy();
      expect(wrapper.getByText("23-Mar-2020")).toBeTruthy();
    });
  });

  it("should open appointment form workspace", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockGetAppointmentsByUuid.mockReturnValue(
      Promise.resolve(mockAppointmentResponse)
    );

    const networkItemSpy = jest.spyOn(
      appointmentResource,
      "openAppointmentWorkspaceItem"
    );
    networkItemSpy.mockImplementation(() => jest.fn());

    wrapper = render(
      <BrowserRouter>
        <AppointmentRecord />
      </BrowserRouter>
    );

    await wait(() => {
      const addButton = wrapper.getByText("Add");

      act(() => {
        fireEvent.click(addButton);
      });

      expect(getAppointmentsByUuid).toHaveBeenCalled();
    });
  });
});
