import { endVisit } from "./visit-button-component";
import React from "react";
import { render, screen } from "@testing-library/react";
import { mockCurrentVisit } from "../../../__mocks__/patient-visits.mock";

describe("End Visit Prompt", () => {
  it("Renders End Visit Prompt", () => {
    const endVisitPrompt = endVisit(mockCurrentVisit);
    const element = React.createElement("div", null, endVisitPrompt);

    render(element);

    expect(
      screen.getByText("Are you sure you wish to end this visit?")
    ).toBeInTheDocument();
  });
});
