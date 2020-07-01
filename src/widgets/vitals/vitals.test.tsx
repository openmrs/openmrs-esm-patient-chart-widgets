import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Vitals from "./vitals.component";

describe("<VitalsComponent />", () => {
  it("renders without dying", () => {
    render(
      <BrowserRouter>
        <Vitals />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Vitals" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
