import React from "react";
import { render, screen } from "@testing-library/react";
import { EndVisit } from "./visit-button-component";
import { visitMode, visitStatus } from "./visit-utils";

const mockCurrentVisit = {
  mode: visitMode.LOADING,
  status: visitStatus.ONGOING,
  visitData: {
    visitType: {
      uuid: "some-uuid1",
      name: "Outpatient Visit",
      display: "Outpatient Visit"
    },
    startDatetime: new Date(),
    uuid: "some-uuid1",
    location: {
      uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
      display: "Inpatient Ward",
      name: "Inpatient Ward"
    },
    encounters: []
  }
};

describe("End Visit Prompt", () => {
  it("Renders end visit prompt", () => {
    render(<EndVisit currentVisit={mockCurrentVisit} />);

    expect(
      screen.getByText("Are you sure you wish to end this visit?")
    ).toBeInTheDocument();
  });
});
