import React from "react";

import { BrowserRouter } from "react-router-dom";
import { screen, render } from "@testing-library/react";

import { ConfigMock } from "../../../__mocks__/chart-widgets-config.mock";
import VisitNotesForm from "./visit-notes-form.component";

let mockConfig = ConfigMock;
const renderVisitNotesForm = () => {
  render(
    <BrowserRouter>
      <VisitNotesForm config={mockConfig} />
    </BrowserRouter>
  );
};

describe("Visit notes form", () => {
  it("renders the visit notes form successfully", () => {
    renderVisitNotesForm();

    expect(
      screen.getByRole("heading", { name: /Add a Visit Note/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Visit Date")).toBeInTheDocument();
    expect(screen.getByText("Diagnosis")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save & Close/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
