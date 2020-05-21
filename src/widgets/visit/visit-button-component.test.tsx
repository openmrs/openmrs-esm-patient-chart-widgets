import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import {
  openmrsObservableFetch,
  useCurrentPatient,
  newWorkspaceItem
} from "@openmrs/esm-api";
import { of } from "rxjs";
import VisitButton from "./visit-button-component";
import {
  mockPatientNoVisitsResponse,
  mockPatientCurrentVisitsResponse,
  mockPatientEndedVisitsResponse
} from "../../../__mocks__/patient-visits.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { newModalItem } from "./visit-dialog-resource";

const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockNewModalItem = newModalItem as jest.Mock;
const mockNewWorkspaceItem = newWorkspaceItem as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  openmrsObservableFetch: jest.fn(),
  useCurrentPatient: jest.fn(),
  newWorkspaceItem: jest.fn()
}));

jest.mock("./visit-dialog-resource", () => ({
  newModalItem: jest.fn()
}));

describe("Visit Button Component", () => {
  afterEach(() => {
    mockOpenmrsObservableFetch.mockReset;
    mockUseCurrentPatient.mockReset;
    mockNewModalItem.mockReset;
    mockNewWorkspaceItem.mockReset;
  });

  beforeEach(() => {
    mockNewModalItem.mockImplementation(() => {});
    mockNewWorkspaceItem.mockImplementation(() => {});
    mockUseCurrentPatient.mockImplementation(() => {
      return [true, mockPatient, "some-patient-uuid", null];
    });
  });

  function setUpMockPatientVisitResponse(mockData: any) {
    mockOpenmrsObservableFetch.mockImplementationOnce(
      (url: string, config: { method: string; body: any }) => {
        if (url.indexOf("/visit?patient=") >= 0) {
          return of(mockData);
        }
        return {};
      }
    );
  }

  it("should show Start Visit View when no visits", () => {
    setUpMockPatientVisitResponse(mockPatientNoVisitsResponse);
    const wrapper = render(<VisitButton />);
    expect(wrapper.queryByTestId("start-visit")).toBeInTheDOM();
  });

  it("should show Visit dashboard on Start button click", async () => {
    setUpMockPatientVisitResponse(mockPatientNoVisitsResponse);
    const wrapper = render(<VisitButton />);
    const startButton = await screen.findByText("Start visit");
    fireEvent.click(startButton);
    expect(mockNewWorkspaceItem).toHaveBeenCalledTimes(1);
  });

  it("should show End Visit view When Current date Visit is Selected", async () => {
    setUpMockPatientVisitResponse(mockPatientCurrentVisitsResponse);
    const wrapper = render(<VisitButton />);
    expect(wrapper.queryByTestId("end-visit")).toBeInTheDOM();
    expect(wrapper.queryByTestId("start-visit")).not.toBeInTheDOM();
  });

  it("should show End Visit prompt on End button click", async () => {
    setUpMockPatientVisitResponse(mockPatientCurrentVisitsResponse);
    const wrapper = render(<VisitButton />);
    const endButton = await screen.findByText("End");
    fireEvent.click(endButton);
    expect(mockNewModalItem).toHaveBeenCalledTimes(1);
  });
});
