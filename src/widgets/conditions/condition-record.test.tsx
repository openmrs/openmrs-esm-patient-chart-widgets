import React from "react";
import { getConditionByUuid } from "./conditions.resource";
import { render, cleanup, wait } from "@testing-library/react";
import { BrowserRouter, match } from "react-router-dom";
import ConditionRecord from "./condition-record.component";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import {
  patient,
  mockPatientConditionResult
} from "../../../__mocks__/conditions.mock";
import { of } from "rxjs";

const mockPerformPatientConditionSearch = getConditionByUuid as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("./conditions.resource", () => ({
  getConditionByUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ConditionRecord />", () => {
  let wrapper: any;

  afterEach(cleanup);
  beforeEach(mockPerformPatientConditionSearch.mockReset);
  beforeEach(
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null])
  );

  it("renders without dying", async () => {
    mockPerformPatientConditionSearch.mockReturnValue(
      of(mockPatientConditionResult)
    );
    wrapper = render(
      <BrowserRouter>
        <ConditionRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("displays a detailed summary of the selected condition", async () => {
    mockPerformPatientConditionSearch.mockReturnValue(
      of(mockPatientConditionResult)
    );
    wrapper = render(
      <BrowserRouter>
        <ConditionRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Condition").textContent).toBeTruthy();
      expect(wrapper.getByText("Edit").textContent).toBeTruthy();
      expect(wrapper.getByText("Renal rejection").textContent).toBeTruthy();
      expect(wrapper.getByText("Jul-2011").textContent).toBeTruthy();
      expect(wrapper.getByText("Active").textContent).toBeTruthy();
      expect(wrapper.getByText("Details").textContent).toBeTruthy();
      expect(wrapper.getByText("Last updated").textContent).toBeTruthy();
      expect(wrapper.getByText("01-Aug-2011").textContent).toBeTruthy();
      expect(wrapper.getByText("Last updated by").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Dr. Katherine Mwangi").textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("Last updated location").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Busia, Clinic").textContent).toBeTruthy();
    });
  });
});
