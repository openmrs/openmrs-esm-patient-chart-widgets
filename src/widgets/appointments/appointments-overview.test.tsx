import React from "react";
import { act } from "react-dom/test-utils";
import { cleanup, render, wait, RenderResult } from "@testing-library/react";
import AppointmentsOverview from "./appointments-overview.component";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { patient } from "../../../__mocks__/allergy.mock";
import { mockAppointmentsResponse } from "../../../__mocks__/appointments.mock";
import { getAppointments } from "./appointments.resource";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockPatientAppointments = getAppointments as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./appointments.resource", () => ({
  getAppointments: jest.fn()
}));

describe("<AppointmentOverview/>", () => {
  let match = {};

  afterEach(cleanup);

  beforeEach(mockPatientAppointments.mockReset);
  beforeEach(() => {
    match = {};
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });
  afterEach(cleanup);

  it("renders without dying", async () => {
    let wrapper: RenderResult;

    mockPatientAppointments.mockResolvedValue(
      Promise.resolve(mockAppointmentsResponse)
    );

    act(() => {
      wrapper = render(
        <BrowserRouter>
          <AppointmentsOverview basePath="/overview" />
        </BrowserRouter>
      );
    });
    await wait(() => {
      expect(true).toEqual(true);
    });
  });

  it("renders the correct columns", async () => {
    let wrapper: RenderResult;

    mockPatientAppointments.mockResolvedValue(
      Promise.resolve(mockAppointmentsResponse)
    );

    act(() => {
      wrapper = render(
        <BrowserRouter>
          <AppointmentsOverview basePath={"/overview"} />
        </BrowserRouter>
      );
    });

    await wait(() => {
      expect(wrapper.getByText("Appointments")).toBeTruthy();
      expect(wrapper.getByText("Date")).toBeTruthy();
      expect(wrapper.getByText("Service Type")).toBeTruthy();
      expect(wrapper.getByText("Status")).toBeTruthy();
      expect(wrapper.getAllByText("Outpatient")).toBeTruthy();
      expect(wrapper.getAllByText("Scheduled")).toBeTruthy();
      expect(getAppointments).toHaveBeenCalled();
    });
  }, 6000);
});
