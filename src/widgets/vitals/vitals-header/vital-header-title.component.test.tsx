import React from "react";
import { getByText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VitalsHeaderStateTitle from "./vital-header-title.component";

describe("<VitalsHeaderStateDetails/>", () => {
  const mockToggleView = jest.fn();

  it("should display the vitals title", () => {
    const mockParamas = {
      view: "Warning",
      date: new Date("12-Mar-2019"),
      toggleView: mockToggleView,
      showDetails: false,
      isEmpty: false
    };
    render(
      <VitalsHeaderStateTitle
        view={mockParamas.view}
        date={mockParamas.date}
        toggleView={mockParamas.toggleView}
        showDetails={mockParamas.showDetails}
        isEmpty={mockParamas.isEmpty}
      />
    );
    expect(
      screen.getByRole("button", { name: /Record Vitals/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Vitals & Biometrics/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Last recorded: 12 - Mar - 2019/i)
    ).toBeInTheDocument();

    const ChevronDown = screen.queryByTitle(/ChevronDown/);
    userEvent.click(ChevronDown);

    expect(mockToggleView).toHaveBeenCalledTimes(1);
  });

  it("should display an empty message when vitals is not recorded", async () => {
    const mockParamas = {
      view: "Warning",
      date: new Date(),
      toggleView: mockToggleView,
      showDetails: false,
      isEmpty: true
    };
    const wrapper = render(
      <VitalsHeaderStateTitle
        view={mockParamas.view}
        date={mockParamas.date}
        toggleView={mockParamas.toggleView}
        showDetails={mockParamas.showDetails}
        isEmpty={mockParamas.isEmpty}
      />
    );
    expect(
      await screen.findByText(/have not been recorded for this patient/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Record Vitals/i })
    ).toBeInTheDocument();
  });
});
