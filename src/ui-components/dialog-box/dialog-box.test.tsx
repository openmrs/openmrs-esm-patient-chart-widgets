import React from "react";
import {
  render,
  RenderResult,
  fireEvent,
  act,
  wait,
  cleanup
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DialogBox from "./dialog-box.component";
import { getDialogBox, newDialogBox } from "./dialog-box.resource";
import { of } from "rxjs";
import { screen } from "@testing-library/dom";

const mockGetDialogBox = getDialogBox as jest.Mock;
const mockNewDialogBox = newDialogBox as jest.Mock;

jest.mock("./dialog-box.resource", () => ({
  getDialogBox: jest.fn(),
  newDialogBox: jest.fn()
}));

function mockComponent(props: mockComponentProps) {
  return (
    <div>
      <h2>Mock Component </h2>
      <button onClick={() => props.closeDialog()}>Close</button>
      <button onClick={() => props.openDialog()}>Open</button>
    </div>
  );
}

type mockComponentProps = {
  closeDialog: () => {};
  openDialog: () => {};
};

beforeEach(() => {
  mockNewDialogBox.mockReturnValue(
    of({ component: mockComponent, name: "Mock Component", props: {} })
  );
  mockGetDialogBox.mockReturnValue(
    of({ component: mockComponent, name: "Mock Component", props: {} })
  );
});

afterEach(() => {
  mockGetDialogBox.mockReset();
  mockNewDialogBox.mockReset();
});

afterEach(cleanup);

describe("<DialogBox", () => {
  it("renders without dying", () => {
    const { container } = render(
      <BrowserRouter>
        <DialogBox />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it("should display the dialog box", () => {
    render(
      <BrowserRouter>
        <DialogBox />
      </BrowserRouter>
    );
    expect(screen.getByText("Mock Component")).toBeTruthy();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("should close and open the dialog box", async () => {
    const { container, getByText } = render(
      <BrowserRouter>
        <DialogBox />
      </BrowserRouter>
    );
    let closeButton = await screen.findByText("Close");
    fireEvent.click(closeButton);

    expect(container.firstChild).toHaveClass("hideDialogBox");
    // open the dialog box
    let openButton = await screen.findByText("Open");
    fireEvent.click(openButton);
    expect(container.firstChild).toHaveClass("dialogBox");
  });
});
