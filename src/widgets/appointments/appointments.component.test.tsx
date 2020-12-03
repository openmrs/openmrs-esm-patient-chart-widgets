import React from "react";
import { render, screen } from "@testing-library/react";
import Appointments from "./appointments.component";
import { MemoryRouter } from "react-router";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    BrowserRouter: jest
      .fn()
      .mockImplementation(({ children }) => <div>{children}</div>)
  };
});

window["getOpenmrsSpaBase"] = jest.fn().mockImplementation(() => "/");

describe("<AppointmentsComponent />", () => {
  it("renders without dying", () => {
    render(
      <MemoryRouter
        initialEntries={["/patient/:patientUuid/chart/appointments"]}
      >
        <Appointments />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Appointments" })
    ).toBeInTheDocument();
  });
});
