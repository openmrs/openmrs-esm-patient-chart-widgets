import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Programs from "./programs.component";

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

describe("<ProgramsComponent />", () => {
  it("renders without dying", () => {
    render(
      <MemoryRouter initialEntries={["/patient/:patientUuid/chart/programs"]}>
        <Programs />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Care Programs/i })
    ).toBeInTheDocument();
  });
});
