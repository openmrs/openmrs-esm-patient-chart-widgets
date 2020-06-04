import React from "react";
import {
  render,
  RenderResult,
  fireEvent,
  act,
  wait
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DialogBox from "./dialog-box.component";
import { getDialogBox, newDialogBox } from "./dialog-box.resource";
import { of } from "rxjs";

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

describe("<DialogBox", () => {
  it("renders without dying", () => {
    const wrapper: RenderResult = render(
      <BrowserRouter>
        <DialogBox />
      </BrowserRouter>
    );
    expect(wrapper).toBeTruthy();
  });

  it("should display the dialog box", () => {
    const { container, getByText } = render(
      <BrowserRouter>
        <DialogBox />
      </BrowserRouter>
    );
    expect(getByText("Mock Component")).toBeTruthy();
    expect(getByText("Close")).toBeInTheDocument();
  });

  it("should close and open the dialog box", () => {
    const { container, getByText } = render(
      <BrowserRouter>
        <DialogBox />
      </BrowserRouter>
    );
    let closeButton = getByText("Close");
    fireEvent.click(closeButton);
    expect(container.querySelector(".hideDialogBox")).toBeInTheDocument();
    // open the dialog box
    let openButton = getByText("Open");
    fireEvent.click(openButton);
    expect(container.querySelector(".dialogBox")).toBeInTheDocument();
  });
});
