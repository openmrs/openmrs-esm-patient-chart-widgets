import React from "react";
import { render, screen } from "@testing-library/react";
import FloatingButton from "./floating-button.component";
import userEvent from "@testing-library/user-event";

const mockOnClick = jest.fn();

describe("<FloatingButton/>", () => {
  beforeEach(() => {
    render(<FloatingButton onButtonClick={mockOnClick} />);
  });

  it("should render without dying", () => {
    const floatingButton = screen.getByTitle("floatingButton");
    expect(floatingButton).toBeInTheDocument();
    userEvent.click(floatingButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
