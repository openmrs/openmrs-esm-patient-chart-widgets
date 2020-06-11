import { endVisit } from "./visit-button-component";
import React from "react";
import { render } from "@testing-library/react";
import { mockCurrentVisit } from "../../../__mocks__/patient-visits.mock";

describe("End Visit Prompt", () => {
  it("Renders End Visit Prompt", () => {
    const endVisitPrompt = endVisit(mockCurrentVisit);
    const element = React.createElement("div", null, endVisitPrompt);
    const wrapper = render(element);
    expect(wrapper).toBeDefined();
    expect(wrapper.getByTestId("end-visit-prompt")).toBeTruthy();
    expect(wrapper.getByTestId("end-visit-message")).toBeTruthy();
    expect(wrapper.getByTestId("end-visit-message").textContent).toBe(
      "Are you sure you wish to end this visit?"
    );
  });
});
