import React from "react";
import { MedicationButton } from "./medication-button.component";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { openWorkspaceTab } from "../shared-utils";
import MedicationOrderBasket from "./medication-order-basket.component";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<MedicationButton/>", () => {
  const mockProps = {
    action: "REVISE",
    drugName: "Test drug",
    label: "Revise",
    orderUuid: "c50a4e48-b3e8-4eb2-8c56-b77991c9531e"
  };

  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
  });

  render(
    <BrowserRouter>
      <MedicationButton {...mockProps} />
    </BrowserRouter>
  );

  it("renders a button which launches the medication order form when clicked", async () => {
    const btn = screen.getByRole("button", { name: "Revise" });
    const { action, drugName, orderUuid } = mockProps;
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalledTimes(1);
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      MedicationOrderBasket,
      "Medication Order Basket",
      { action, drugName, orderUuid }
    );
  });
});
