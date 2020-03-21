import React from "react";
import { act } from "react-dom/test-utils";
import { cleanup, render, wait, RenderResult } from "@testing-library/react";
import AppointmentsOverview from "./appointments-overview.component";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { patient } from "../../../__mocks__/allergy.mock";
import { appointment } from "./appointments.mock";
import { getAppointments } from "./appointments.resource";
import dayjs from "dayjs";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockPatientAppointments = getAppointments as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./appointments.resource", () => ({
  getAppointments: jest.fn()
}));

beforeEach(mockPatientAppointments.mockReset);
afterEach(cleanup);

describe("<AppointmentOverview/>", () => {
  let match = {};
  it("renders without dying", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPatientAppointments.mockResolvedValue(Promise.resolve(appointment));

    act(() => {
      render(
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

    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockPatientAppointments.mockResolvedValue(Promise.resolve(appointment));

    act(() => {
      wrapper = render(
        <BrowserRouter>
          <AppointmentsOverview basePath={"/overview"} />
        </BrowserRouter>
      );
    });

    await wait(() => {
      expect(wrapper.getByText("Appointments Overview")).toBeTruthy();
      expect(wrapper.getByText("Service Type")).toBeTruthy();
      expect(wrapper.getByText("Status")).toBeTruthy();
      expect(wrapper.getAllByText("22:02:20")[0]).toBeTruthy();
      expect(getAppointments).toHaveBeenCalled();
    });
  }, 6000);
});
