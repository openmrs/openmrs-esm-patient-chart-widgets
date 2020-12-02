import React from "react";
import { getByText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VitalsHeaderStateTitle from "./vital-header-title.component";
import { PatientVitals } from "../vitals-card.resource";

describe("<VitalsHeaderStateDetails/>", () => {
  const mockToggleView = jest.fn();

  const mockVitals: PatientVitals = {
    id: "bca4d5f1-ee6a-4282-a5ff-c8db12c4247c",
    date: new Date("12-Mar-2019"),
    systolic: "120",
    diastolic: "80",
    temperature: " 36.5",
    oxygenSaturation: "88",
    weight: "85",
    height: "185",
    bmi: "24.8",
    respiratoryRate: "45"
  };

  it("should display the vitals title", () => {
    const mockParamas = {
      view: "Warning",
      toggleView: mockToggleView,
      showDetails: false,
      isEmpty: false
    };
    render(
      <VitalsHeaderStateTitle
        view={mockParamas.view}
        vitals={mockVitals}
        toggleView={mockParamas.toggleView}
        showDetails={mockParamas.showDetails}
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
    render(
      <VitalsHeaderStateTitle
        view={mockParamas.view}
        vitals={null}
        toggleView={mockParamas.toggleView}
        showDetails={mockParamas.showDetails}
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
